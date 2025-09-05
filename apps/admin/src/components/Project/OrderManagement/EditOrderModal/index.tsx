import React, { useEffect, useState } from 'react';
import { CourseStatusType, CourseType, DialogAction, GetCoursesResponseDTO, ModalType } from '@repo/shared';
import { Dayjs } from 'dayjs';
import { Form, Formik, FormikProps } from 'formik';
import * as Yup from 'yup';

import CoreButton from '@/CIBase/CoreButton';
import CoreLoaders from '@/CIBase/CoreLoaders';
import CoreAnchorModal from '@/CIBase/CoreModal/CoreAnchorModal';
import CoreBlock from '@/CIBase/CoreModal/CoreAnchorModal/CoreBlock';
import { StyledAbsoluteModalActions } from '@/CIBase/CoreModal/CoreModalActions';
import FormikDatePicker from '@/components/Common/CIBase/Formik/FormikDatePicker';
import { FormikScrollToError } from '@/Formik/common/FormikComponents';
import useModalProvider from '@/hooks/useModalProvider';

import ConfirmPaymentModal from './PaymentInfoBlock/ConfirmPaymentModal';
import CourseReservation from './CourseReservation';
import FixedPaymentBlock from './FixedPaymentBlock';
import JoinedMembersBlock from './JoinedMembersBlock';
import OrderChangesBlock from './OrderChangesBlock';
import OrderInfoBlock from './OrderInfoBlock';
import PaymentInfoBlock from './PaymentInfoBlock';

const anchorItems = [
	{ id: 'az1', label: '訂單資訊', requireFields: [] },
	{ id: 'az2', label: '付款資訊', requireFields: [] },
	{ id: 'az3', label: '課程預約', requireFields: [] },
	{ id: 'az4', label: '參加人員名單', requireFields: [] },
	{ id: 'az5', label: '訂單異動紀錄', requireFields: [] },
];

interface InitialValuesProps {
	courseExpiryDate: Dayjs | null;
}

interface EditOrderModalProps {
	handleCloseModal?: (action: DialogAction) => void;
	handleRefresh?: () => void;
	formRef?: React.RefObject<FormikProps<InitialValuesProps>>;
	modalType: ModalType;
	rowData?: GetCoursesResponseDTO;
	courseType: CourseType;
	courseStatusType: CourseStatusType;
}

const EditOrderModal = ({
	modalType,
	courseType,
	courseStatusType,
	handleCloseModal,
	handleRefresh,
	rowData,
}: EditOrderModalProps) => {
	const modal = useModalProvider();
	const [courseInfo, setMemberInfo] = useState({
		no: '--',
		type: {
			[CourseType.PRIVATE]: '私人課',
			[CourseType.GROUP]: '團體課',
			[CourseType.INDIVIDUAL]: '個人練習',
		}[courseType],
		teachingType: {
			[CourseType.PRIVATE]: '教練授課',
			[CourseType.GROUP]: '教練授課',
			[CourseType.INDIVIDUAL]: '無教練授課',
		}[courseType],
		status: {
			[CourseStatusType.DRAFT]: '草稿',
			[CourseStatusType.PUBLISHED]: '排程中',
			[CourseStatusType.SCHEDULED]: '已上架',
			[CourseStatusType.UNPUBLISHED]: '已下架',
		}[courseStatusType],
	});

	const [courseDesc, setCourseDesc] = useState<any[]>([
		{
			id: 0,
			desc: '',
		},
	]);

	const [status, setStatus] = useState('待付訂金');

	// --- API ---

	// --- EFFECTS ---

	useEffect(() => {
		console.log({ courseDesc });
	}, [courseDesc]);

	useEffect(() => {
		if (modalType === ModalType.EDIT && rowData) {
			setMemberInfo((prevState) => ({
				...prevState,
				no: rowData.no,
			}));
		}
	}, [modalType, rowData]);

	// --- FORMIK ---

	const [initialValues, setInitialValues] = useState<InitialValuesProps>({
		courseExpiryDate: null,
	});

	const validationSchema = Yup.object().shape({
		courseExpiryDate: Yup.date().nullable().required('必填'),
	});

	const handleFormSubmit = async (values: InitialValuesProps) => {
		console.log({ values });

		// if (statusCode === HttpStatusCode.OK) {
		// 	handleCloseModal?.(DialogAction.CONFIRM);
		// 	handleRefresh?.();
		// }
	};

	const isLoading = false;

	return (
		<Formik
			initialValues={initialValues}
			onSubmit={handleFormSubmit}
			validationSchema={validationSchema}
			enableReinitialize
		>
			{({ isSubmitting, values }) => {
				return (
					<Form>
						{isLoading || (isSubmitting && <CoreLoaders hasOverlay />)}
						<FormikScrollToError />
						<CoreAnchorModal anchorItems={anchorItems} rightContent={<FixedPaymentBlock status={status} handleRefresh={(data) => setStatus(data)} />}>
							<CoreBlock title='訂單資訊'>
								<OrderInfoBlock />
							</CoreBlock>
							{
								status === '待付訂金'
								? <CoreBlock
										title='付款資訊'
										buttonLabel='確認收到訂金'
										handleClick={() => {
												modal.openModal({
													title: `確認收到訂金`,
													width: 480,
													noEscAndBackdrop: true,
													noAction: true,
													noTitleBorder: true,
													children: <ConfirmPaymentModal type='downPayment' handleRefresh={(result) => {
														setStatus(result);
													}} />,
												});
											}
										}
									>
										<PaymentInfoBlock />
									</CoreBlock>
								: <CoreBlock title='付款資訊' >
									<PaymentInfoBlock />
								</CoreBlock>
							}
						
							<CoreBlock
								title='課程預約'
								buttonLabel='新增預約'
								buttonIsLink
								handleClick={() => {
									window.open('/reservation-management/indoor-course', '_blank');
								}}
							>
								<CourseReservation />
								<FormikDatePicker
									name='courseExpiryDate'
									title='課程使用期限'
									isRequired
									placeholder='YYYY/MM/DD'
									width='200px'
									format='YYYY/MM/DD'
									// disabled={isReadonly}
									disablePast
								/>
							</CoreBlock>
							<CoreBlock
								title='參加人員名單'
								buttonLabel='轉讓'
								handleClick={() => {
									console.log('轉讓');
								}}
							>
								<JoinedMembersBlock />
							</CoreBlock>
							<CoreBlock title='訂單異動紀錄'>
								<OrderChangesBlock />
							</CoreBlock>
						</CoreAnchorModal>
						<StyledAbsoluteModalActions justifyContent='flex-end' gap='12px'>
							<CoreButton
								color='default'
								variant='outlined'
								label='取消'
								onClick={() => handleCloseModal?.(DialogAction.CANCEL)}
							/>
							<CoreButton color='primary' variant='contained' type='submit' label='確認' />
						</StyledAbsoluteModalActions>
					</Form>
				);
			}}
		</Formik>
	);
};

export default EditOrderModal;
