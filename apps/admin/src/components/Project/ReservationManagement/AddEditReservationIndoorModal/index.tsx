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
	CreateReservationRequestDto,
	SkiAndSnowboardLevelEnum,
	ReservationStatusEnum,
} from '@repo/shared';
import dayjs, { Dayjs } from 'dayjs';
import { Form, Formik, FormikProps } from 'formik';
import * as Yup from 'yup';
import { useReservationDetail, useCreateReservation, useUpdateReservation } from '@/hooks/useReservation';
import { useReservationMembers } from '@/hooks/useReservationMembers';

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
import MemberList from './MemberList';

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
	courseLevel: SkiAndSnowboardLevelEnum;
	departmentId: string;
}

interface AddEditReservationIndoorModalProps {
	handleCloseModal?: (action: DialogAction) => void;
	handleRefresh?: () => void;
	formRef?: React.RefObject<FormikProps<InitialValuesProps>>;
	modalType: ModalType;
	rowData?: GetCoursesResponseDTO;
	courseType: CourseType;
	courseStatusType: CourseStatusType;
	reservationId?: string;
}

const AddEditReservationIndoorModal = ({
	modalType,
	courseType,
	courseStatusType,
	handleCloseModal,
	handleRefresh,
	rowData,
	reservationId,
}: AddEditReservationIndoorModalProps) => {
	const modal = useModalProvider();
	const { reservationDetail, loading: detailLoading, fetchReservationDetail } = useReservationDetail();
	const { loading: createLoading, createNewReservation } = useCreateReservation();
	const { loading: updateLoading, updateExistingReservation } = useUpdateReservation();
	const { members: savedMembers, loading: membersLoading, fetchMembers, addMember, removeMember } = useReservationMembers();

	// 本地狀態管理待新增和待刪除的成員
	const [pendingAddMembers, setPendingAddMembers] = useState<any[]>([]);
	const [pendingRemoveMembers, setPendingRemoveMembers] = useState<string[]>([]);

	// 合併已儲存和待新增的成員，排除待刪除的成員
	const displayMembers = React.useMemo(() => {
		const saved = savedMembers.filter(m => !pendingRemoveMembers.includes(m.id));
		return [...saved, ...pendingAddMembers];
	}, [savedMembers, pendingAddMembers, pendingRemoveMembers]);

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
		const loadReservationData = async () => {
			if (modalType === ModalType.EDIT && reservationId) {
				await fetchReservationDetail(reservationId);
			} else if (modalType === ModalType.ADD) {
				// 新增模式：設置部門 ID 從 localStorage
				const departmentId = localStorage.getItem('departmentId');
				if (departmentId) {
					setInitialValues((prevState) => ({
						...prevState,
						departmentId: departmentId,
					}));
				}
			}
		};

		loadReservationData();
	}, [modalType, reservationId]);

	// 當獲取到預約詳情時更新表單和課程資訊
	useEffect(() => {
		if (reservationDetail) {
			console.log('reservationDetail: ', reservationDetail);
			// 更新課程資訊
			setMemberInfo((prevState) => ({
				...prevState,
				no: reservationDetail.reservationNo.toString(),
			}));

			// 更新表單初始值
			setInitialValues({
				pickTrainer: reservationDetail.instructor ? 'Y' : 'N',
				trainerName: reservationDetail.instructor || '',
				courseStartDate: dayjs(reservationDetail.classTime),
				courseLevel: reservationDetail.teachingLevel,
				departmentId: localStorage.getItem('departmentId') || '',
			});

			// 載入預約成員
			fetchMembers(reservationDetail.id);
		}
	}, [reservationDetail, fetchMembers]);

	// --- FORMIK ---

	const [initialValues, setInitialValues] = useState<InitialValuesProps>({
		pickTrainer: 'N',
		trainerName: '',
		courseStartDate: null,
		courseLevel: '1' as SkiAndSnowboardLevelEnum,
		departmentId: '',
	});

	const validationSchema = Yup.object().shape({
		pickTrainer: Yup.string().required('必填欄位'),
		trainerName: Yup.string().when('pickTrainer', ([pickTrainer], schema) => {
			return pickTrainer === 'Y' ? schema.required('必填欄位') : schema.notRequired();
		}),
		courseStartDate: Yup.date().nullable().required('必填'),
		courseLevel: Yup.string().required('必填欄位'),
		departmentId: Yup.string().required('必填欄位'),
	});

	// 處理選擇成員 - 加入到待處理列表
	const handleSelectMember = (member: any) => {
		// 檢查是否已經存在（避免重複加入）
		const alreadyExists = displayMembers.some(m =>
			(m.orderMember?.id === member.id) || (m.id === member.id)
		);

		if (alreadyExists) {
			console.warn('此成員已在列表中');
			return;
		}

		// 將成員轉換為與 savedMembers 相同的格式
		const formattedMember = {
			id: `pending-${member.id}`, // 暫時的 ID
			orderMemberId: member.id,
			orderMember: member,
		};

		setPendingAddMembers(prev => [...prev, formattedMember]);
		console.log('成員已加入待處理列表，將在按下更新按鈕後儲存');
	};

	// 處理移除成員 - 加入到待刪除列表或從待新增列表移除
	const handleRemoveMember = (memberId: string) => {
		// 檢查是否為待新增的成員
		const isPending = memberId.startsWith('pending-');

		if (isPending) {
			// 從待新增列表中移除
			setPendingAddMembers(prev => prev.filter(m => m.id !== memberId));
		} else {
			// 加入到待刪除列表
			setPendingRemoveMembers(prev => [...prev, memberId]);
		}
		console.log('成員已標記為刪除，將在按下更新按鈕後生效');
	};

	const handleFormSubmit = async (values: InitialValuesProps) => {
		const reservationData: CreateReservationRequestDto = {
			departmentId: values.departmentId,
			classTime: values.courseStartDate!.toDate(),
			teachingLevel: values.courseLevel,
			instructor: values.pickTrainer === 'Y' ? values.trainerName : undefined,
			reservationStatus: '1', // SCHEDULED 狀態
		};

		let success = false;

		if (modalType === ModalType.EDIT && reservationId) {
			// 更新模式
			success = await updateExistingReservation(reservationId, reservationData);

			if (success) {
				// 更新成功後，處理成員的新增和刪除
				console.log('開始處理成員變更...');

				// 1. 刪除待刪除的成員
				for (const memberId of pendingRemoveMembers) {
					const deleteSuccess = await removeMember(memberId);
					if (!deleteSuccess) {
						console.error(`刪除成員 ${memberId} 失敗`);
					}
				}

				// 2. 新增待新增的成員
				for (const member of pendingAddMembers) {
					const addSuccess = await addMember({
						reservationId: reservationId,
						orderMemberId: member.orderMemberId,
					});
					if (!addSuccess) {
						console.error(`新增成員 ${member.orderMemberId} 失敗`);
					}
				}

				// 3. 清空待處理列表
				setPendingAddMembers([]);
				setPendingRemoveMembers([]);

				console.log('成員變更處理完成');
			}
		} else {
			// 建立模式
			success = await createNewReservation(reservationData);
		}

		if (success) {
			handleCloseModal?.(DialogAction.CONFIRM);
			handleRefresh?.();
		}
		// 錯誤處理已經在 hook 中完成
	};

	const isLoading = detailLoading || createLoading || updateLoading;

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
										width: 800,
										height: 600,
										noAction: true,
										noEscAndBackdrop: true,
										children: (
											<AddMemberModal
												onSelectMember={handleSelectMember}
												handleCloseModal={(action) => {
													if (action === 'confirm') {
														modal.closeModal();
													}
												}}
											/>
										),
									});
								}}
							>
								{modalType === ModalType.ADD ? (
									<BlockArea>請先建立預約後再加入成員</BlockArea>
								) : (
									<BlockArea>
										<MemberList
											members={displayMembers}
											onRemoveMember={handleRemoveMember}
											loading={membersLoading}
										/>
									</BlockArea>
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
								<ReservationInfo
									courseInfo={courseInfo}
									reservationDetail={reservationDetail}
									courseType={courseType}
								/>
								<FormikDateTimePicker
									name='courseStartDate'
									title='上課時間'
									isRequired
									placeholder='yyyy/mm/dd hh:mm'
									width='220px'
									format='YYYY/MM/DD hh:mm'
									margin='0 10px 10px 0'
									// disabled={isReadonly}
									disablePast
								/>
								<FormikInput name='courseLevel' title='授課等級' width='192px' isRequired placeholder='1-20' />
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
								color='default'
								variant='outlined'
								label='關閉'
								onClick={() => handleCloseModal?.(DialogAction.CANCEL)}
								margin='0 12px 0 0'
							/>
							<CoreButton
								color='error'
								variant='outlined'
								label='取消'
								customIcon={<DoDisturbOnOutlinedIcon />}
								onClick={() => handleCloseModal?.(DialogAction.CANCEL)}
								margin='0 12px 0 0'
							/>
							<CoreButton
								color='primary'
								variant='contained'
								type='submit'
								label={modalType === ModalType.EDIT ? '更新' : '建立'}
							/>
						</StyledAbsoluteModalActions>
					</Form>
				);
			}}
		</Formik>
	);
};

export default AddEditReservationIndoorModal;
