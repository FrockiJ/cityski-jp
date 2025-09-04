import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { DialogAction, HttpStatusCode, ModalType, UserTableListResult } from '@repo/shared';
import { FieldArray, Form, Formik, FormikProps } from 'formik';
import * as Yup from 'yup';

import CoreModalContent from '@/CIBase/CoreModal/ModalContent';
import FormikInput from '@/CIBase/Formik/FormikInput';
import FormikSelect from '@/CIBase/Formik/FormikSelect';
import FormikSwitch from '@/CIBase/Formik/FormikSwitch';
import CoreButton from '@/components/Common/CIBase/CoreButton';
import CoreLoaders from '@/components/Common/CIBase/CoreLoaders';
import { FormikScrollToError } from '@/components/Common/CIBase/Formik/common/FormikComponents';
import api from '@/utils/http/api';
import { generalErrorHandler } from '@/utils/http/handler';
import { useLazyRequest, useRequest } from '@/utils/http/hooks';
import { showToast } from '@/utils/ui/general';

import * as Components from '../shared/Components';

const tableHeader = [{ name: '分店', width: '150px' }, { name: '角色', width: '200px' }, { name: ' ' }];

interface InitialValuesProps {
	modalType: ModalType;
	email: string;
	name: string;
	status: boolean;
	departmentsWithRoles: {
		departmentId: string;
		roleId: string;
	}[];
}

interface AddEditUserModalProps {
	userId?: string;
	rowData?: UserTableListResult;
	handleCloseModal?: (action: DialogAction) => void;
	handleRefresh?: () => void;
	modalType?: ModalType;
	accountId?: number;
	formRef?: React.RefObject<FormikProps<InitialValuesProps>>;
}

const AddEditUserModal = ({
	userId,
	handleCloseModal,
	handleRefresh,
	modalType,
	rowData,
	formRef,
}: AddEditUserModalProps) => {
	// --- API ---

	const [createUser, { loading: createUserLoading }] = useLazyRequest(api.createUser, {
		onError: generalErrorHandler,
		onSuccess: () => showToast(`已新增`, 'success'),
	});

	const [updateUser, { loading: updateUserLoading }] = useLazyRequest(api.updateUser, {
		onError: generalErrorHandler,
		onSuccess: () => showToast(`已更新`, 'success'),
	});

	const [getUserByEmail, { loading: getUserByEmailLoading }] = useLazyRequest(api.getUserByEmail, {
		onError: generalErrorHandler,
	});

	const { data: getDepartmentsData, loading: getDepartmentsLoading } = useRequest(() => api.getDepartments(), {
		onError: generalErrorHandler,
	});

	const { data: getRolesData, loading: getRolesLoading } = useRequest(() => api.getRoles(), {
		onError: generalErrorHandler,
	});

	// --- EFFECTS ---

	useEffect(() => {
		async function fetchData() {
			if (modalType === ModalType.EDIT && rowData) {
				const { result, statusCode } = await getUserByEmail({ email: rowData.email });

				if (statusCode === HttpStatusCode.OK) {
					setInitialValues({
						modalType,
						email: result.email,
						name: result.name,
						status: Boolean(result.status),
						departmentsWithRoles: rowData.userRolesDepartments.map((x) => ({
							departmentId: x.department.id,
							roleId: x.role.id,
						})),
					});
				}
			}
		}

		fetchData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [modalType, rowData]);

	// --- FORMIK ---

	const [initialValues, setInitialValues] = useState<InitialValuesProps>({
		modalType: ModalType.ADD,
		email: '',
		name: '',
		status: false,
		departmentsWithRoles: [
			{
				departmentId: '',
				roleId: '',
			},
		],
	});

	const validationSchema = Yup.object().shape({
		email: Yup.string().email('Email domain無效').required('必填欄位'),
		name: Yup.string().required('必填欄位'),
		status: Yup.mixed().when(['modalType'], { is: ModalType.EDIT, then: (schema) => schema.required('必填欄位') }),
		departmentsWithRoles: Yup.array().of(
			Yup.object().shape({
				departmentId: Yup.string().required('必填欄位'),
				roleId: Yup.string().required('必填欄位'),
			}),
		),
	});

	const handleOnSubmit = async (values: InitialValuesProps) => {
		const { name, email, status, departmentsWithRoles } = values;

		if (modalType === ModalType.ADD) {
			const { statusCode } = await createUser({ name, email, departmentsWithRoles });

			if (statusCode === HttpStatusCode.CREATED) {
				handleRefresh?.();
				handleCloseModal?.(DialogAction.CONFIRM);
			}
		}

		if (modalType === ModalType.EDIT && userId) {
			const { statusCode } = await updateUser({ id: userId, name, status: Number(status), departmentsWithRoles });

			if (statusCode === HttpStatusCode.OK) {
				handleRefresh?.();
				handleCloseModal?.(DialogAction.CONFIRM);
			}
		}
	};

	const isLoading =
		getUserByEmailLoading || getDepartmentsLoading || getRolesLoading || createUserLoading || updateUserLoading;

	return (
		<Formik
			innerRef={formRef}
			enableReinitialize
			initialValues={initialValues}
			validationSchema={validationSchema}
			onSubmit={handleOnSubmit}
		>
			{({ values, isSubmitting, setFieldValue }) => (
				<Form autoComplete='off'>
					{isLoading || (isSubmitting && <CoreLoaders hasOverlay />)}
					<FormikScrollToError />
					<CoreModalContent padding='24px 0'>
						{ModalType.EDIT && rowData ? (
							<>
								<Typography variant='body2' color='text.secondary'>
									帳號
								</Typography>
								<Typography>{rowData.email}</Typography>
							</>
						) : (
							<FormikInput
								name='email'
								title='帳號'
								placeholder='輸入'
								disabled={modalType === ModalType.VIEW}
								isRequired
								width='100%'
								helperText='帳號請輸入Email'
								hasTextCountAdornment
								textCount={values.email.length}
								maxTextCount={50}
							/>
						)}

						<FormikInput
							name='name'
							title='使用者名稱'
							placeholder='輸入'
							disabled={modalType === ModalType.VIEW}
							isRequired
							width='100%'
							margin='24px 0 0 0'
							hasTextCountAdornment
							textCount={values.name.length}
							maxTextCount={10}
						/>

						{ModalType.EDIT && rowData && (
							<FormikSwitch
								name='status'
								title='帳號狀態'
								label={`${values.status ? '啟' : '停'}用`}
								margin='24px 0 0 0'
								onChange={(_event, value) => {
									setFieldValue('status', value);
								}}
								checked={values.status}
								disabled={rowData.isSuperAdmin}
								isRequired
							/>
						)}

						<Box sx={{ margin: '24px 0 0 0' }}>
							<Components.Row header>
								{tableHeader.map(({ name, width }) => (
									<Components.StyledCell header key={name} width={width}>
										{name}
									</Components.StyledCell>
								))}
							</Components.Row>
							<FieldArray name='departmentsWithRoles'>
								{({ push, remove }) => (
									<>
										{values.departmentsWithRoles &&
											values.departmentsWithRoles.length > 0 &&
											values.departmentsWithRoles.map((item, index) => (
												<Components.Row key={index}>
													<Components.StyledCell width='150px'>
														<FormikSelect
															name={`departmentsWithRoles[${index}].departmentId`}
															placeholder='選擇'
															options={
																getDepartmentsData?.result.map((x) => {
																	const isDisabledOption = values.departmentsWithRoles
																		.map((x) => x.departmentId)
																		.includes(x.id);
																	return { label: x.name, value: x.id, ...(isDisabledOption && { isDisabled: true }) };
																}) ?? []
															}
															isRequired
															width='100%'
															menuPortal
															margin='0'
															maxMenuHeight={150}
															disabled={modalType === ModalType.VIEW || rowData?.isSuperAdmin}
														/>
													</Components.StyledCell>
													<Components.StyledCell width='200px'>
														<FormikSelect
															name={`departmentsWithRoles[${index}].roleId`}
															placeholder='選擇'
															options={
																getRolesData?.result.data
																	.filter((x) => (rowData?.isSuperAdmin ? x : !x.superAdm))
																	.map((x) => ({
																		label: x.name,
																		value: x.id,
																	})) ?? []
															}
															isRequired
															width='100%'
															menuPortal
															margin='0'
															maxMenuHeight={150}
															disabled={modalType === ModalType.VIEW || rowData?.isSuperAdmin}
														/>
													</Components.StyledCell>
													<Components.StyledCell>
														{!rowData?.isSuperAdmin && values.departmentsWithRoles.length > 1 && (
															<CoreButton variant='text' color='error' label='刪除' onClick={() => remove(index)} />
														)}
													</Components.StyledCell>
												</Components.Row>
											))}

										{values.departmentsWithRoles.length < 3 && !rowData?.isSuperAdmin && (
											<Components.Row>
												<Components.StyledCell>
													<CoreButton
														variant='outlined'
														iconType='add'
														label='新增分店'
														onClick={() => push({ departmentId: '', roleId: '' })}
													/>
												</Components.StyledCell>
											</Components.Row>
										)}
									</>
								)}
							</FieldArray>
						</Box>
					</CoreModalContent>
				</Form>
			)}
		</Formik>
	);
};

export default AddEditUserModal;
