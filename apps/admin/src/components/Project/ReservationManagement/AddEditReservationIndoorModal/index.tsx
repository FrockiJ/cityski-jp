import React, { useEffect, useState } from 'react';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import DoDisturbOnOutlinedIcon from '@mui/icons-material/DoDisturbOnOutlined';
import { Stack } from '@mui/material';
import {
	BtnActionType,
	CourseStatusType,
	CourseType,
	DialogAction,
	GetCoursesResponseDTO,
	ModalType,
} from '@repo/shared';
import { Dayjs } from 'dayjs';
import { Form, Formik, FormikProps } from 'formik';
import * as Yup from 'yup';

import CoreButton from '@/CIBase/CoreButton';
import CoreLoaders from '@/CIBase/CoreLoaders';
import CoreAnchorModal from '@/CIBase/CoreModal/CoreAnchorModal';
import CoreBlock from '@/CIBase/CoreModal/CoreAnchorModal/CoreBlock';
import { StyledAbsoluteModalActions } from '@/CIBase/CoreModal/CoreModalActions';
import FormikDateTimePicker from '@/components/Common/CIBase/Formik/FormikDateTimePicker';
import FormikInput from '@/components/Common/CIBase/Formik/FormikInput';
import FormikRadio from '@/components/Common/CIBase/Formik/FormikRadio';
import { FormikScrollToError } from '@/Formik/common/FormikComponents';
import useModalProvider from '@/hooks/useModalProvider';

import BlockArea from '../../shared/BlockArea';
import AddMemberModal from '../AddMemberModal';

import OrderChangesBlock from './OrderChangesBlock';
import ReservationInfo from './ReservationInfo';

const anchorItems = [
	{ id: 'basic', label: '參加成員', requireFields: [] },
	{ id: 'courseIntroduce', label: '預約資訊', requireFields: [] },
	{ id: 'planInfo', label: '上課紀錄', requireFields: [] },
	{ id: 'courseManage', label: '訂單異動紀錄', requireFields: [] },
];

interface InitialValuesProps {
	pickTrainer: string;
	trainerName: string;
	courseStartDate: Dayjs | null;
	courseLevel: string;
}

interface AddEditReservationIndoorModalProps {
	handleCloseModal?: (action: DialogAction) => void;
	handleRefresh?: () => void;
	formRef?: React.RefObject<FormikProps<InitialValuesProps>>;
	modalType: ModalType;
	rowData?: GetCoursesResponseDTO;
	courseType: CourseType;
	courseStatusType: CourseStatusType;
}

const AddEditReservationIndoorModal = ({
	modalType,
	courseType,
	courseStatusType,
	handleCloseModal,
	handleRefresh,
	rowData,
}: AddEditReservationIndoorModalProps) => {
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
			[CourseStatusType.SCHEDULED]: '排程中',
			[CourseStatusType.PUBLISHED]: '已上架',
			[CourseStatusType.UNPUBLISHED]: '已下架',
		}[courseStatusType],
	});

	const [courseDesc, setCourseDesc] = useState<any[]>([
		{
			id: 0,
			desc: '',
		},
	]);

	// const [pickTrainer, setPickTrainer] = useState(false);

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
		pickTrainer: 'N',
		trainerName: '',
		courseStartDate: null,
		courseLevel: '',
	});

	const validationSchema = Yup.object().shape({
		pickTrainer: Yup.string().required('必填欄位'),
		trainerName: Yup.string().when('pickTrainer', ([pickTrainer], schema) => {
			return pickTrainer === 'Y' ? schema.required('必填欄位') : schema.notRequired();
		}),
		courseStartDate: Yup.date().nullable().required('必填'),
		courseLevel: Yup.string().required('必填欄位'),
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
						<CoreAnchorModal anchorItems={anchorItems}>
							<CoreBlock
								title='參加成員'
								buttonLabel='加入成員'
								buttonIconType={BtnActionType.ADD}
								handleClick={() => {
									modal.openModal({
										title: `加入成員`,
										width: 635,
										height: 600,
										noAction: true,
										noEscAndBackdrop: true,
										children: <AddMemberModal />,
									});
								}}
							>
								{modalType === ModalType.ADD ? (
									<BlockArea>目前無參加人員</BlockArea>
								) : (
									<BlockArea>目前無參加人員</BlockArea>
								)}
							</CoreBlock>
							<CoreBlock
								title='預約資訊'
								buttonLabel='課程資訊'
								buttonIconType={BtnActionType.LINK}
								handleClick={() => {
									console.log('課程資訊');
								}}
							>
								<ReservationInfo />
								<FormikDateTimePicker
									name='courseStartDate'
									title='上課時間'
									isRequired
									placeholder='yyyy/mm/dd hh:mm'
									width='220px'
									format='YYYY/MM/DD hh:mm'
									margin='0 10px 0 0'
									// disabled={isReadonly}
									disablePast
								/>
								<FormikInput name='courseLevel' title='授課等級' width='192px' isRequired placeholder='請輸入等級' />
								<Stack mt={3}>
									<FormikRadio
										name='pickTrainer'
										title='指定教練'
										width='192px'
										isRequired
										radios={[
											{ label: '指定', value: 'Y' },
											{ label: '不指定', value: 'N' },
										]}
									/>
									<BlockArea>
										<FormikInput
											name='trainerName'
											title='教練'
											width='320px'
											isRequired={values.pickTrainer === 'Y'}
											placeholder='請輸入教練名字'
										/>
									</BlockArea>
								</Stack>
							</CoreBlock>
							<CoreBlock title='上課紀錄'>
								<BlockArea>加入成員紀錄上課情形</BlockArea>
							</CoreBlock>
							<CoreBlock title='訂單異動紀錄'>
								<OrderChangesBlock />
							</CoreBlock>
						</CoreAnchorModal>
						<StyledAbsoluteModalActions justifyContent='flex-end'>
							<CoreButton
								color='primary'
								variant='text'
								label='複製課程'
								customIcon={<ContentCopyOutlinedIcon />}
								onClick={() => handleCloseModal?.(DialogAction.CANCEL)}
								margin='0 12px 0 0'
							/>
							<CoreButton
								color='error'
								variant='text'
								label='刪除'
								iconType='delete'
								onClick={() => handleCloseModal?.(DialogAction.CANCEL)}
								margin='0 12px 0 0'
							/>
							<CoreButton
								color='error'
								variant='text'
								label='取消排程'
								customIcon={<DoDisturbOnOutlinedIcon />}
								onClick={() => handleCloseModal?.(DialogAction.CANCEL)}
								margin='0 12px 0 0'
							/>
							<CoreButton
								color='error'
								variant='text'
								label='立即下架'
								customIcon={<DoDisturbOnOutlinedIcon />}
								onClick={() => handleCloseModal?.(DialogAction.CANCEL)}
								margin='0 12px 0 0'
							/>
							<CoreButton
								color='default'
								variant='outlined'
								label='取消'
								onClick={() => handleCloseModal?.(DialogAction.CANCEL)}
								margin='0 12px 0 0'
							/>
							<CoreButton
								color='default'
								variant='outlined'
								label='儲存為草稿'
								onClick={() => handleCloseModal?.(DialogAction.CANCEL)}
								margin='0 12px 0 0'
							/>
							<CoreButton color='primary' variant='contained' type='submit' label='確認' />
							<CoreButton color='primary' variant='contained' type='submit' label='確認排程' />
						</StyledAbsoluteModalActions>
					</Form>
				);
			}}
		</Formik>
	);
};

export default AddEditReservationIndoorModal;
