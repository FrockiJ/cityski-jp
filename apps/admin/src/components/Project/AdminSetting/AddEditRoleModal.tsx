import { useEffect, useState } from 'react';
import { Typography } from '@mui/material';
import { DialogAction, HttpStatusCode, MenuDTO, ModalType } from '@repo/shared';
import { Form, Formik, FormikProps } from 'formik';
import * as Yup from 'yup';

import CoreLoaders from '@/CIBase/CoreLoaders';
import CoreModalContent from '@/CIBase/CoreModal/ModalContent';
import { FormikScrollToError } from '@/Formik/common/FormikComponents';
import FormikInput from '@/Formik/FormikInput';
import { useAppSelector } from '@/state/store';
import api from '@/utils/http/api';
import { generalErrorHandler } from '@/utils/http/handler';
import { useLazyRequest } from '@/utils/http/hooks';
import { showToast } from '@/utils/ui/general';

import RoleAccessControl from './RoleAccessControl';

export interface MenuCheckedDTO extends MenuDTO {
	checked?: boolean;
	subPages?: MenuCheckedDTO[];
}

interface InitialValuesProps {
	name: string;
}

interface AddEditRoleModalProps {
	handleCloseModal?: (action: DialogAction) => void;
	handleRefresh?: () => void;
	modalType?: ModalType;
	roleId?: string;
	formRef?: React.RefObject<FormikProps<InitialValuesProps>>;
}

const AddEditRoleModal = ({ handleCloseModal, handleRefresh, modalType, roleId, formRef }: AddEditRoleModalProps) => {
	const navList = useAppSelector((state) => state.auth.navList);
	const newNavList = navList.map((nav) => ({
		...nav,
		checked: true,
		...(Array.isArray(nav.subPages) && {
			subPages: nav.subPages.map((subNav) => ({ ...subNav, checked: true })),
		}),
	}));

	const [showAtLeastMsg, setShowAtLeastMsg] = useState('');
	const [isSuperAdm, setIsSuperAdm] = useState(false);
	const [menus, setMenus] = useState<MenuCheckedDTO[] | undefined>(newNavList);

	// --- API ---

	const [createRole, { loading: createRoleLoading }] = useLazyRequest(api.createRole, {
		onError: generalErrorHandler,
		onSuccess: () => showToast(`已新增`, 'success'),
	});

	const [getRoleDetail, { loading: getRoleDetailLoading }] = useLazyRequest(api.getRoleDetail, {
		onError: generalErrorHandler,
	});

	const [updateRole, { loading: updateRoleLoading }] = useLazyRequest(api.updateRole, {
		onError: generalErrorHandler,
		onSuccess: () => showToast(`已更新`, 'success'),
	});

	// --- FUNCTIONS ---

	const getMenuIds = (menus: MenuCheckedDTO[]) =>
		menus.reduce((acc: string[], cur) => {
			if (cur.checked) {
				acc.push(cur.id);

				if (cur.subPages) {
					cur.subPages.forEach((subNav) => {
						if (subNav.checked) {
							acc.push(subNav.id);
						}
					});
				}
			}

			return acc;
		}, []);

	const handleCheck = (menu: MenuCheckedDTO, menuId: string, checked: boolean) => {
		setMenus((prevState) => {
			let newState: MenuCheckedDTO[] = JSON.parse(JSON.stringify(prevState));
			let targetMenu = newState.find((pageItem) => pageItem.id === menu.id);

			const checkSelfAndChild = (nav: MenuCheckedDTO) => {
				if (nav.subPages && nav.subPages.length > 0) {
					nav.subPages.forEach((subNav: MenuCheckedDTO) => {
						checkSelfAndChild(subNav);
					});
				}

				nav.checked = checked;
			};

			const findMenu = (nav: MenuCheckedDTO) => {
				// 還有子層的話 父層勾選子層都一起勾
				if (nav.id === menuId) {
					checkSelfAndChild(nav);
				} else {
					if (nav.subPages && nav.subPages.length > 0) {
						nav.subPages.forEach((subNav) => {
							findMenu(subNav);
						});

						const isAllUnChecked = nav.subPages.every((subNav) => !subNav.checked);
						const isSomeChecked = nav.subPages.some((subNav) => subNav.checked);

						// 檢查子層是否全部無勾選，是的話父層也不勾
						if (isAllUnChecked && !checked) {
							nav.checked = checked;
						}
						// 檢查子層是否部分勾選，是的話父層就要勾選
						if (isSomeChecked && checked) {
							nav.checked = checked;
						}
					}
				}
			};

			if (!targetMenu) return;
			findMenu(targetMenu);

			return newState;
		});
	};

	// --- EFFECTS ---

	useEffect(() => {
		async function fetchData() {
			if (modalType === ModalType.EDIT && roleId) {
				const { result, statusCode } = await getRoleDetail({ roleId });

				if (statusCode === HttpStatusCode.OK) {
					setInitialValues({
						name: result.name,
					});

					setIsSuperAdm(Boolean(result.superAdm));

					setMenus((prevState) => {
						prevState?.map((nav) => {
							nav.checked = result.menuIds.includes(nav.id);

							if (nav.subPages && nav.subPages.length > 0) {
								nav.subPages.forEach((subNav) => {
									subNav.checked = result.menuIds.includes(subNav.id);
								});
							}
						});

						return prevState;
					});
				}
			}
		}

		fetchData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [modalType, roleId]);

	// --- FORMIK ---

	const [initialValues, setInitialValues] = useState<InitialValuesProps>({
		name: '',
	});

	const validationSchema = Yup.object().shape({
		name: Yup.string().required('必填欄位'),
	});

	const handleOnSubmit = async (values: InitialValuesProps) => {
		if (!menus) return;

		const menuIds = getMenuIds(menus);

		if (menuIds.length === 0) {
			setShowAtLeastMsg('至少須勾選一個權限');
			return;
		}

		if (modalType === ModalType.ADD) {
			const { statusCode } = await createRole({
				name: values.name,
				menuIds,
			});

			if (statusCode === HttpStatusCode.CREATED) {
				setShowAtLeastMsg('');
				handleRefresh?.();
				handleCloseModal?.(DialogAction.CONFIRM);
			}
		}

		if (modalType === ModalType.EDIT && roleId) {
			const { statusCode } = await updateRole({
				id: roleId,
				name: values.name,
				menuIds,
			});

			if (statusCode === HttpStatusCode.OK) {
				setShowAtLeastMsg('');
				handleRefresh?.();
				handleCloseModal?.(DialogAction.CONFIRM);
			}
		}
	};

	const isLoading = createRoleLoading || updateRoleLoading || getRoleDetailLoading;

	if (!menus) return null;

	return (
		<Formik
			innerRef={formRef}
			enableReinitialize
			initialValues={initialValues}
			validationSchema={validationSchema}
			onSubmit={handleOnSubmit}
		>
			{({ values, isSubmitting }) => (
				<Form autoComplete='off'>
					{isLoading || (isSubmitting && <CoreLoaders hasOverlay />)}
					<FormikScrollToError />
					<CoreModalContent padding='24px 0'>
						<Typography variant='h6'>基本資料</Typography>
						<FormikInput
							title='角色名稱'
							placeholder='輸入'
							name='name'
							isRequired
							margin='24px 0 0 0'
							width='100%'
							hasTextCountAdornment
							textCount={values.name.length}
							maxTextCount={20}
						/>
						<RoleAccessControl
							menus={menus}
							handleCheck={handleCheck}
							modalType={modalType}
							title='權限設定'
							showAtLeastMsg={showAtLeastMsg}
							isSuperAdm={isSuperAdm}
						/>
					</CoreModalContent>
				</Form>
			)}
		</Formik>
	);
};

export default AddEditRoleModal;
