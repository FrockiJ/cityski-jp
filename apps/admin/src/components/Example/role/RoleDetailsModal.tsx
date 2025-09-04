import { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { Form, Formik, FormikProps, FormikValues } from 'formik';

import CoreButton from '@/CIBase/CoreButton';
import CoreLoaders from '@/CIBase/CoreLoaders';
import CoreModalActions from '@/CIBase/CoreModal/CoreModalActions';
import CoreModalContent from '@/CIBase/CoreModal/ModalContent';
import FormikInput from '@/CIBase/Formik/FormikInput';
import { ModalMode } from '@/shared/types/general';
import { NavWithPermissionModel } from '@/shared/types/roleModel';

import useGetRoleMenu from './hooks/useGetRoleMenu';
import RoleAccessControl from './RoleAccessControl';
import { StyledButtonWrapper } from './styles';

interface RoleDetailsModalProps {
	onClick?: () => void;
	mutate?: any;
	mode?: ModalMode;
	roleId?: number;
	formRef?: React.RefObject<FormikProps<FormikValues>>;
}
type AuthType = 'edit' | 'view';

const RoleDetailsModal = ({ onClick: close, mode = 'view', roleId, formRef }: RoleDetailsModalProps) => {
	const [showAtLeastMsg, setShowAtLeastMsg] = useState('');

	const { menuData, initialValuesRoleName, loading } = useGetRoleMenu({
		mode,
		roleId,
	});
	const [authData, setAuthData] = useState<NavWithPermissionModel[] | undefined>(menuData);

	useEffect(() => {
		if (menuData) setAuthData(menuData);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [JSON.stringify(menuData)]);

	const handleCheck = (rootData: NavWithPermissionModel, id: string, checked: boolean, authType?: AuthType): void => {
		// console.log('@handleCheck id:', id)
		// console.log('@handleCheck checked:', checked)
		// console.log('@handleCheck authType:', authType)
		// console.log('@handleCheck rootData:', rootData)
		setAuthData((prev) => {
			if (!prev) return;
			let editData: NavWithPermissionModel[] = JSON.parse(JSON.stringify(prev));
			let targetPage = editData.find((pageItem) => pageItem.id === rootData.id);

			const checkSelfAndChild = (page: NavWithPermissionModel) => {
				if (page.subPages.length > 0) {
					page.subPages.forEach((subPage: NavWithPermissionModel) => {
						checkSelfAndChild(subPage);
					});
				}

				if (authType) {
					// view不勾，edit也要取消勾
					if (authType === 'view' && !checked) {
						Object.keys(page.permissions).forEach((key) => {
							page.permissions[key as AuthType] = checked;
						});
					}
					// edit勾，view也要勾
					if (authType === 'edit' && checked) {
						Object.keys(page.permissions).forEach((key) => {
							page.permissions[key as AuthType] = checked;
						});
					}
					page.permissions[authType] = checked;
				} else {
					Object.keys(page.permissions).forEach((key) => {
						page.permissions[key as AuthType] = checked;
					});
				}
			};

			// findPage是子層的控制, checkSelfAndChild是父層的控制,但有可能會重複控制到部分層級的勾選,因為父層也可能是子層
			const findPage = (page: NavWithPermissionModel) => {
				// 還有子層的話 父層勾選子層都一起勾
				if (page.id === id) {
					checkSelfAndChild(page);
				} else {
					if (page.subPages.length > 0) {
						page.subPages.forEach((subPage) => {
							findPage(subPage);
						});

						if (authType) {
							const isAllUnChecked = page.subPages.every((subPage) => {
								return !subPage.permissions[authType];
							});
							const isSomeChecked = page.subPages.some((subPage) => {
								return subPage.permissions[authType];
							});
							// 檢查子層是否全部無勾選，是的話父層也不勾
							if (isAllUnChecked && !checked) {
								// view不勾，edit也要取消勾
								if (authType === 'view') {
									Object.keys(page.permissions).forEach((key) => {
										page.permissions[key as AuthType] = checked;
									});
								}
								page.permissions[authType] = checked;
							}
							// 檢查子層是否部分勾選，是的話父層就要勾選
							if (isSomeChecked && checked) {
								// edit勾，view也要勾
								if (authType === 'edit' && checked) {
									Object.keys(page.permissions).forEach((key) => {
										page.permissions[key as AuthType] = checked;
									});
								}
								page.permissions[authType] = checked;
							}
						} else {
							// 此處一定是view跟edit一起被勾選，但以view代表判斷
							const isAllUnChecked = page.subPages.every((subPage) => {
								return !subPage.permissions.view;
							});
							const isSomeChecked = page.subPages.some((subPage) => {
								return subPage.permissions.view;
							});
							// 檢查子層是否全部無勾選，是的話父層也不勾
							if (isAllUnChecked && !checked) {
								Object.keys(page.permissions).forEach((key) => {
									page.permissions[key as AuthType] = checked;
								});
							}
							// 檢查子層是否部分勾選，是的話父層就要勾選
							if (isSomeChecked && checked) {
								Object.keys(page.permissions).forEach((key) => {
									page.permissions[key as AuthType] = checked;
								});
							}
						}
					}
				}
			};

			if (!targetPage) return;
			findPage(targetPage);

			return editData;
		});
	};

	const onCancel = () => {
		close?.();
	};

	if (!menuData || loading) return <CoreLoaders />;

	return (
		<Formik
			innerRef={formRef}
			initialValues={{
				role_name: initialValuesRoleName,
			}}
			onSubmit={async ({ role_name: name }, { setSubmitting, setErrors }) => {
				setSubmitting(true);
				setShowAtLeastMsg('');
				let isError = false;
				if (!name) {
					setErrors({ role_name: '必填欄位' });
					isError = true;
				}
				// if (
				//   !authData?.some(({ children }) =>
				//     children.some(({ group }) => group.some(({ checked }) => checked))
				//   )
				// ) {
				//   setShowAtLeastMsg('至少須勾選一個權限');
				//   isError = true;
				// }
				if (isError) return;
				close?.();
			}}
		>
			{({ isSubmitting }) => (
				<Form autoComplete='off'>
					<CoreModalContent>
						<Box typography='h6'>基本資料</Box>
						<FormikInput
							title='角色名稱'
							placeholder='請輸入角色名稱'
							name='role_name'
							size='medium'
							isRequired={true}
							margin='24px 0 0 0'
							width='100%'
						/>
						<RoleAccessControl
							data={authData}
							handleCheck={handleCheck}
							mode={mode}
							title='權限設定'
							showAtLeastMsg={showAtLeastMsg}
						/>
					</CoreModalContent>

					<CoreModalActions>
						<StyledButtonWrapper>
							{mode === 'view' ? (
								<CoreButton label='關閉' variant='outlined' onClick={() => onCancel()} />
							) : (
								<>
									<CoreButton variant='outlined' label='取消' onClick={() => onCancel()} />
									<CoreButton
										color='primary'
										variant='contained'
										type='submit'
										label={mode === 'add' ? '確認' : '儲存'}
										isSubmitting={isSubmitting}
									/>
								</>
							)}
						</StyledButtonWrapper>
					</CoreModalActions>
				</Form>
			)}
		</Formik>
	);
};

export default RoleDetailsModal;
