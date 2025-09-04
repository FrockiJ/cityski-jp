import { useCallback, useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import {
	DialogAction,
	DiscountStatus,
	DiscountType,
	GetDiscountResponseDTO,
	HttpStatusCode,
	MessageType,
	ModalType,
} from '@repo/shared';
import dayjs, { Dayjs } from 'dayjs';
import { Form, Formik, FormikHelpers, FormikProps } from 'formik';
import { showToast } from 'src/utils/ui/general';
import * as Yup from 'yup';

import CoreButton from '@/CIBase/CoreButton';
import CoreLoaders from '@/components/Common/CIBase/CoreLoaders';
import FormikDatePicker from '@/Formik/FormikDatePicker';
import FormikInput from '@/Formik/FormikInput';
import FormikRadio from '@/Formik/FormikRadio';
import FormikSelect from '@/Formik/FormikSelect';
import useModalProvider from '@/hooks/useModalProvider';
import api from '@/utils/http/api';
import { generalErrorHandler } from '@/utils/http/handler';
import { useLazyRequest } from '@/utils/http/hooks';

import * as Components from '../../shared/Components';

import { StyledActionArea } from './styles';

interface InitialValuesProps {
	id?: string;
	code: string;
	status: DiscountStatus;
	type: DiscountType;
	discount: string;
	createdTime: Dayjs | null;
	endDate: Dayjs | null;
	usageLimit: string;
	usageLimitCount: string;
	note?: string;
}

type AddEditViewDiscountModalProps = {
	modalType: ModalType;
	rowData?: GetDiscountResponseDTO;
	formRef?: React.RefObject<FormikProps<InitialValuesProps>>;
	handleCloseModal?: (action: DialogAction) => void;
	handleRefresh?: () => void;
};

enum USAGE_LIMIT {
	UNLIMITED = '0',
	LIMITED = '1',
}

const AddEditViewDiscountModal = ({
	rowData,
	modalType,
	formRef,
	handleCloseModal,
	handleRefresh,
}: AddEditViewDiscountModalProps) => {
	const isReadonly = modalType === ModalType.EDIT || modalType === ModalType.VIEW;
	const modal = useModalProvider();

	// --- API ---

	const [createDiscount, { loading: createDiscountLoading }] = useLazyRequest(api.createDiscount, {
		onError: generalErrorHandler,
		onSuccess: () => showToast('新增成功', 'success'),
	});

	const [updateDiscount, { loading: updateDiscountLoading }] = useLazyRequest(api.updateDiscount, {
		onError: generalErrorHandler,
		onSuccess: () => showToast('已更新', 'success'),
	});

	const [deleteDiscount, { loading: deleteDiscountLoading }] = useLazyRequest(api.deleteDiscount, {
		onError: generalErrorHandler,
	});

	const [checkDiscountCode] = useLazyRequest(api.checkDiscountCode);

	// --- EFFECTS ---

	useEffect(() => {
		if (rowData) {
			setInitialValues({
				id: rowData.id,
				code: rowData.code,
				status: rowData.status,
				type: rowData.type,
				discount: rowData.discount ? String(rowData.discount) : '',
				createdTime: dayjs(rowData.createdTime),
				endDate: dayjs(rowData.endDate),
				usageLimit: rowData.usageLimit === 0 ? USAGE_LIMIT.UNLIMITED : USAGE_LIMIT.LIMITED,
				usageLimitCount: String(rowData.usageLimit),
				note: rowData.note,
			});
		}
	}, [rowData]);

	// --- FORMIK ---

	const [initialValues, setInitialValues] = useState<InitialValuesProps>({
		code: '',
		status: DiscountStatus.ACTIVE,
		type: DiscountType.AMOUNT,
		discount: '',
		createdTime: dayjs(),
		endDate: null,
		usageLimit: USAGE_LIMIT.UNLIMITED,
		usageLimitCount: '',
		note: undefined,
	});

	const validationSchema = Yup.object().shape({
		code: Yup.string().required('必填').max(5),
		status: Yup.string().required('必填'),
		type: Yup.string().required('必填'),
		discount: Yup.string()
			.trim()
			.when(['type'], {
				is: DiscountType.AMOUNT,
				then: (schema) => schema.matches(/^[0-9]+$/, '只能輸入正整數'),
				otherwise: (schema) => schema.matches(/^(?:10(?:\.0)?|[1-9](?:\.[0-9])?|0\.[1-9])$/, '請輸入0~10之間的數字'),
			})
			.required('必填'),
		createdTime: Yup.date().nullable().required('必填'),
		endDate: Yup.date().nullable().required('必填'),
		usageLimit: Yup.string().required('必填'),
		usageLimitCount: Yup.string().when(['usageLimit'], {
			is: USAGE_LIMIT.LIMITED,
			then: (schema) => schema.required('必填欄位'),
		}),
		note: Yup.string(),
	});

	// --- FUNCTIONS ---

	const handleDelete = useCallback(
		(discountId: string) => {
			modal.openMessageModal({
				type: MessageType.ERROR,
				title: `刪除此折扣碼`,
				content: `一旦刪除，將查無此折扣碼紀錄`,
				confirmLabel: `刪除`,
				onClose: async (action) => {
					if (action === DialogAction.CONFIRM) {
						const { statusCode } = await deleteDiscount({ discountId });

						if (statusCode === HttpStatusCode.OK) {
							showToast(`已刪除`, 'success');
							handleRefresh?.();
							handleCloseModal?.(DialogAction.CONFIRM);
						}
					}
				},
			});
		},
		[deleteDiscount, handleCloseModal, handleRefresh, modal],
	);

	const handleOnBlur = async (
		code: string,
		setFieldError: FormikHelpers<InitialValuesProps>['setFieldError'],
		setFieldTouched: FormikHelpers<InitialValuesProps>['setFieldTouched'],
	) => {
		if (code.length === 5) {
			let errorMsg = '';

			await checkDiscountCode({
				departmentId: localStorage.getItem('departmentId') ?? '',
				code,
			}).catch((error) => (errorMsg = error.message));

			await setFieldTouched('code', true);

			setFieldError('code', errorMsg);
		}
	};

	const handleFormSubmit = async (values: InitialValuesProps) => {
		if (modalType === ModalType.ADD) {
			const payload = {
				departmentId: localStorage.getItem('departmentId') ?? '',
				code: values.code,
				status: values.status ? DiscountStatus.ACTIVE : DiscountStatus.INACTIVE,
				type: values.type,
				discount: Number(values.discount),
				endDate: dayjs(values.endDate).format('YYYY-MM-DD'),
				usageLimit: values.usageLimit === '0' ? 0 : Number(values.usageLimitCount),
				note: values.note ?? '',
			};

			const { statusCode } = await createDiscount(payload);

			if (statusCode === HttpStatusCode.CREATED) {
				handleCloseModal?.(DialogAction.CONFIRM);
				handleRefresh?.();
			}
		}

		if (modalType === ModalType.EDIT) {
			const payload = {
				id: values.id ?? '',
				status: values.status ? DiscountStatus.ACTIVE : DiscountStatus.INACTIVE,
			};

			const { statusCode } = await updateDiscount(payload);

			if (statusCode === HttpStatusCode.OK) {
				handleCloseModal?.(DialogAction.CONFIRM);
				handleRefresh?.();
			}
		}
	};

	const isLoading = createDiscountLoading || updateDiscountLoading || deleteDiscountLoading;

	return (
		<Formik
			innerRef={formRef}
			enableReinitialize
			initialValues={initialValues}
			validationSchema={validationSchema}
			onSubmit={handleFormSubmit}
		>
			{({ isSubmitting, values, setFieldValue, setFieldError, setFieldTouched }) => (
				<Form>
					{isLoading && <CoreLoaders hasOverlay />}
					<FormikInput
						name='code'
						title='折扣碼名稱'
						placeholder='輸入'
						margin='24px 0 0 0'
						width='100%'
						isRequired
						disabled={isReadonly}
						hasTextCountAdornment
						textCount={values.code.length}
						maxTextCount={5}
						onBlur={() => handleOnBlur(values.code, setFieldError, setFieldTouched)}
					/>
					<FormikSelect
						name='type'
						title='折扣類型'
						placeholder='請選擇'
						options={[
							{ label: '折扣金額', value: DiscountType.AMOUNT },
							{ label: '折扣比例', value: DiscountType.PERCENT },
						]}
						isRequired
						width='100%'
						menuPortal
						disabled={isReadonly}
						margin='24px 0 12px 0'
						onChange={() => setFieldValue('discount', '')}
					/>
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'baseline',
							padding: '12px 16px',
							mb: 3,
							borderRadius: 2,
							backgroundColor: 'background.light',
						}}
					>
						<FormikInput
							name='discount'
							width={140}
							placeholder='輸入'
							inputStyle={{ backgroundColor: '#FFF' }}
							{...(values.type === DiscountType.AMOUNT
								? {
										startAdornment: <Components.StyledAdornment type='start'>NT$</Components.StyledAdornment>,
										isNumberOnly: true,
									}
								: {
										endAdornment: <Components.StyledAdornment type='end'>折</Components.StyledAdornment>,
										isNumberWithOneDecimal: true,
									})}
							hasClearIcon={false}
							disabled={isReadonly}
						/>
						{values.type === DiscountType.PERCENT && (
							<Typography sx={{ pl: 1, fontSize: 12, color: 'text.secondary' }}>
								範例：打9折，請在欄位輸入9；打85折，請在欄位輸入8.5
							</Typography>
						)}
					</Box>
					<FormikDatePicker
						name='endDate'
						title='到期日期'
						isRequired
						placeholder='選擇日期'
						width='100%'
						margin='0 0 24px 0'
						format='YYYY/MM/DD'
						disabled={isReadonly}
						disablePast
					/>
					<FormikRadio
						name='usageLimit'
						title='人數限制'
						isRequired
						margin='0 0 12px 0'
						radios={[
							{
								label: '不限人數',
								value: USAGE_LIMIT.UNLIMITED,
							},
							{
								label: '限制人數',
								value: USAGE_LIMIT.LIMITED,
							},
						]}
						disabled={isReadonly}
					/>

					{values.usageLimit === USAGE_LIMIT.LIMITED && (
						<Box
							sx={{
								display: 'flex',
								alignItems: 'baseline',
								padding: '12px 16px',
								mb: 3,
								borderRadius: 2,
								backgroundColor: 'background.light',
							}}
						>
							<Typography variant='body1' sx={{ mr: 1.5, color: isReadonly ? 'text.quaternary' : 'text.primary' }}>
								人數上限
							</Typography>

							<FormikInput
								name='usageLimitCount'
								width={140}
								placeholder='輸入'
								inputStyle={{ backgroundColor: '#FFF' }}
								endAdornment={<Components.StyledAdornment type='end'>人</Components.StyledAdornment>}
								hasClearIcon={false}
								disabled={isReadonly}
							/>
						</Box>
					)}
					<FormikInput
						name='note'
						title='備註'
						placeholder='輸入'
						margin='0 0 24px 0'
						width='100%'
						rows={3}
						hasClearIcon={false}
						multiline
						disabled={isReadonly}
					/>

					<StyledActionArea
						justifyContent={modalType === ModalType.ADD || modalType === ModalType.VIEW ? 'flex-end' : 'space-between'}
					>
						{modalType === ModalType.EDIT && rowData && rowData.isUsed && (
							<Typography variant='body2' sx={{ fontSize: 13, color: 'text.quaternary' }}>
								此折扣碼已被使用無法刪除
							</Typography>
						)}
						{modalType === ModalType.EDIT && rowData && !rowData.isUsed && (
							<CoreButton
								color='error'
								variant='text'
								iconType='delete'
								label='刪除'
								onClick={() => rowData && handleDelete(rowData.id)}
							/>
						)}

						<div>
							{modalType === ModalType.EDIT || modalType === ModalType.VIEW ? (
								<CoreButton variant='contained' label='關閉' onClick={() => handleCloseModal?.(DialogAction.CANCEL)} />
							) : (
								<>
									<CoreButton
										color='default'
										variant='outlined'
										label='取消'
										onClick={() => handleCloseModal?.(DialogAction.CANCEL)}
										margin='0 12px 0 0'
									/>

									<CoreButton variant='contained' type='submit' label='確認' isSubmitting={isSubmitting} />
								</>
							)}
						</div>
					</StyledActionArea>
				</Form>
			)}
		</Formik>
	);
};

export default AddEditViewDiscountModal;
