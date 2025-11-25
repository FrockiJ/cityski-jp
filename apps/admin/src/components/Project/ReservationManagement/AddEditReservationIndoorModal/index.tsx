import React, { useEffect, useState } from 'react';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import DoDisturbOnOutlinedIcon from '@mui/icons-material/DoDisturbOnOutlined';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { Stack, Alert, AlertTitle } from '@mui/material';
import {
	BtnActionType,
	CourseStatusType,
	CourseType,
	CourseBkgType,
	DialogAction,
	GetCoursesResponseDTO,
	ModalType,
	CreateReservationRequestDto,
	SkiAndSnowboardLevelEnum,
	ReservationStatusEnum,
	ReservationStatus,
	GetOrderDetailResponseDTO,
	CourseTeachingType,
} from '@repo/shared';
import dayjs, { Dayjs } from 'dayjs';
import { Form, Formik, FormikProps } from 'formik';
import * as Yup from 'yup';
import {
	useReservationDetail,
	useCreateReservation,
	useUpdateReservation,
} from '@/hooks/useReservation';
import { useReservationMembers } from '@/hooks/useReservationMembers';
import { useGetOrderDetail } from '@/hooks/useGetOrderDetail';
import { getCourseDetail } from '@/utils/http/api/course';

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
import NoteBox from '../NoteBox';
import RescheduleReasonModal from './RescheduleReasonModal';
import CancelReservationModal from './CancelReservationModal';
import SubmitAttendanceConfirmModal from '../SubmitAttendanceConfirmModal';

const anchorItems = [
	{ id: 'basic', label: '參加成員', requireFields: [] },
	{ id: 'courseIntroduce', label: '預約資訊', requireFields: [] },
	{ id: 'planInfo', label: '上課紀錄', requireFields: [] },
	{ id: 'courseManage', label: '預約異動紀錄', requireFields: [] },
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
	orderId?: string;
	reservationIndex?: number;
}

const AddEditReservationIndoorModal = ({
	modalType,
	courseType,
	courseStatusType,
	handleCloseModal,
	handleRefresh,
	rowData,
	reservationId,
	orderId,
	reservationIndex,
}: AddEditReservationIndoorModalProps) => {
	const modal = useModalProvider();
	const { reservationDetail, loading: detailLoading, fetchReservationDetail } = useReservationDetail();
	const { loading: createLoading, createNewReservation } = useCreateReservation();
	const { loading: updateLoading, updateExistingReservation } = useUpdateReservation();
	const {
		members: savedMembers,
		loading: membersLoading,
		fetchMembers,
		addMember,
		removeMember,
		updateMember,
	} = useReservationMembers();

	// 在 edit mode 時，orderId 從 reservationDetail 讀取；在 add mode 時從 props 讀取
	const [effectiveOrderId, setEffectiveOrderId] = useState<string | undefined>(
		modalType === ModalType.ADD ? orderId : undefined,
	);

	const { orderDetail, loading: orderDetailLoading } = useGetOrderDetail(effectiveOrderId);

	// Debug: 監測 effectiveOrderId 變化
	useEffect(() => {
		console.log('effectiveOrderId 已更新為:', effectiveOrderId);
	}, [effectiveOrderId]);

	// 本地狀態管理待新增和待刪除的成員
	const [pendingAddMembers, setPendingAddMembers] = useState<any[]>([]);
	const [pendingRemoveMembers, setPendingRemoveMembers] = useState<string[]>([]);

	// 管理成員的備註和出席狀態
	const [memberNotes, setMemberNotes] = useState<Record<string, { note: string; attended: boolean }>>({});

	// 課程詳情狀態
	const [courseDetail, setCourseDetail] = useState<any>(null);
	const [courseDetailLoading, setCourseDetailLoading] = useState(false);

	// 改期原因 Modal 狀態
	const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);
	const [pendingFormValues, setPendingFormValues] = useState<InitialValuesProps | null>(null);

	// 送出上課紀錄確認 Modal 狀態
	const [submitAttendanceModalOpen, setSubmitAttendanceModalOpen] = useState(false);

	// 取消預約 Modal 狀態
	const [cancelReservationModalOpen, setCancelReservationModalOpen] = useState(false);

	// 合併已儲存和待新增的成員，排除待刪除的成員
	const displayMembers = React.useMemo(() => {
		const saved = savedMembers.filter((m) => !pendingRemoveMembers.includes(m.id));
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

	// 當從訂單頁面跳轉過來新增預約時，自動填入訂單成員到待新增列表
	useEffect(() => {
		if (modalType === ModalType.ADD && orderDetail && orderDetail.orderMembers && orderDetail.orderMembers.length > 0) {
			console.log('從訂單跳轉，自動填入成員列表:', orderDetail.orderMembers);

			// 將訂單成員轉換為待新增成員格式
			const formattedMembers = orderDetail.orderMembers.map((orderMember: any) => ({
				id: `pending-${orderMember.id}`,
				orderMemberId: orderMember.id,
				orderMember: {
					member: {
						name: orderMember.memberName,
						phone: orderMember.memberPhone,
						avatar: orderMember.avatar,
						id: orderMember.memberId,
						skis: orderMember.skis,
						snowboard: orderMember.snowboard,
					},
					memberId: orderMember.memberId,
					order: orderDetail,
					orderId: orderDetail.id,
				},
			}));

			setPendingAddMembers(formattedMembers);

			// 更新課程資訊顯示訂單編號
			if (orderDetail.no) {
				setMemberInfo((prevState) => ({
					...prevState,
					no: orderDetail.no,
				}));
			}
		}
	}, [modalType, orderDetail]);

	// 當獲取到 orderDetail 時，通過 courseId 獲取課程詳情
	useEffect(() => {
		const fetchCourseDetail = async () => {
			if (orderDetail?.courseId) {
				setCourseDetailLoading(true);
				try {
					const response = await getCourseDetail(orderDetail.courseId);
					const course = response.result;
					setCourseDetail(course);

					// 更新課程資訊（類型和人數）
					setMemberInfo((prevState) => ({
						...prevState,
						no: orderDetail.no || '--',
						type:
							{
								[CourseType.PRIVATE]: '私人課',
								[CourseType.GROUP]: '團體課',
								[CourseType.INDIVIDUAL]: '個人練習',
							}[orderDetail.type] || prevState.type,
						teachingType: course.teachingType === CourseTeachingType.COACH ? '教練授課' : '無教練授課',
					}));

					console.log('課程詳情:', course);
				} catch (error) {
					console.error('獲取課程詳情失敗:', error);
				} finally {
					setCourseDetailLoading(false);
				}
			}
		};

		fetchCourseDetail();
	}, [orderDetail]);

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

	// 當獲取到 savedMembers 時，在 edit mode 從第一個成員取得 orderId
	useEffect(() => {
		if (modalType === ModalType.EDIT && savedMembers.length > 0) {
			const orderIdFromMember = savedMembers[0]?.orderMember?.orderId;
			console.log('從 savedMembers 取得的 orderId:', orderIdFromMember);
			if (orderIdFromMember) {
				console.log('設定 effectiveOrderId 為:', orderIdFromMember);
				setEffectiveOrderId(orderIdFromMember);
			} else {
				console.warn('無法從 savedMembers 取得 orderId');
			}
		}
	}, [modalType, savedMembers]);

	// 初始化成員備註狀態
	useEffect(() => {
		if (savedMembers.length > 0) {
			const notes: Record<string, { note: string; attended: boolean }> = {};
			savedMembers.forEach((member) => {
				notes[member.id] = {
					note: member.note || '',
					attended: member.attended !== undefined ? member.attended : true, // 從資料庫讀取或預設為出席
				};
			});
			setMemberNotes(notes);
		}
	}, [savedMembers]);

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

	// 計算並更新授課等級的輔助函數
	const calculateMinLevel = (members: any[]) => {
		if (!orderDetail) return null;

		const skiType = orderDetail.skiType;
		let minLevel = Infinity;

		members.forEach((m) => {
			const memberData = m.orderMember?.member;
			if (memberData) {
				let memberLevel: number;

				if (skiType === 1) {
					// 雙板課程，使用 skis 等級
					memberLevel = Number(memberData.skis) || Infinity;
				} else if (skiType === 2) {
					// 單板課程，使用 snowboard 等級
					memberLevel = Number(memberData.snowboard) || Infinity;
				} else {
					// 單板和雙板，取較小值
					const skisLevel = Number(memberData.skis) || Infinity;
					const snowboardLevel = Number(memberData.snowboard) || Infinity;
					memberLevel = Math.min(skisLevel, snowboardLevel);
				}

				if (memberLevel < minLevel) {
					minLevel = memberLevel;
				}
			}
		});

		return minLevel === Infinity ? null : minLevel;
	};


	// 處理選擇成員 - 加入到待處理列表
	const handleSelectMember = (member: any) => {
		// 檢查是否已經存在（避免重複加入）
		const alreadyExists = displayMembers.some((m) => m.orderMember?.id === member.id || m.id === member.id);

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

		setPendingAddMembers((prev) => [...prev, formattedMember]);
		console.log('成員已加入待處理列表，將在按下更新按鈕後儲存');
	};

	// 處理移除成員 - 加入到待刪除列表或從待新增列表移除
	const handleRemoveMember = (memberId: string) => {
		// 檢查是否為待新增的成員
		const isPending = memberId.startsWith('pending-');

		if (isPending) {
			// 從待新增列表中移除
			setPendingAddMembers((prev) => prev.filter((m) => m.id !== memberId));
		} else {
			// 加入到待刪除列表
			setPendingRemoveMembers((prev) => [...prev, memberId]);
		}
		console.log('成員已標記為刪除，將在按下更新按鈕後生效');
	};

	// 處理備註變更
	const handleNoteChange = (memberId: string, note: string) => {
		setMemberNotes((prev) => ({
			...prev,
			[memberId]: {
				...prev[memberId],
				note,
			},
		}));
	};

	// 處理出席狀態變更
	const handleAttendedChange = (memberId: string, attended: boolean) => {
		setMemberNotes((prev) => ({
			...prev,
			[memberId]: {
				...prev[memberId],
				attended,
			},
		}));
	};

	const handleFormSubmit = async (values: InitialValuesProps) => {
		// 編輯模式下檢查預約狀態是否為待評價(2)
		if (modalType === ModalType.EDIT && reservationDetail?.reservationStatus === ReservationStatus.PENDING_REVIEW) {
			// 狀態為待評價，需要顯示送出上課紀錄確認 Modal
			setPendingFormValues(values);
			setSubmitAttendanceModalOpen(true);
			return;
		}

		// 編輯模式下檢測上課時間是否有變更
		if (modalType === ModalType.EDIT && reservationId && reservationDetail?.classTime) {
			const originalClassTime = dayjs(reservationDetail.classTime);
			const newClassTime = values.courseStartDate;

			// 比較時間是否有變更（精確到分鐘）
			const hasTimeChanged = newClassTime && !originalClassTime.isSame(newClassTime, 'minute');

			if (hasTimeChanged) {
				// 時間有變更，先儲存表單數據並顯示 Modal
				setPendingFormValues(values);
				setRescheduleModalOpen(true);
				return;
			}
		}

		// 直接執行更新（無時間變更或新增模式）
		await executeSubmit(values);
	};

	// 處理送出上課紀錄確認
	const handleSubmitAttendanceConfirm = async () => {
		setSubmitAttendanceModalOpen(false);
		if (pendingFormValues) {
			await executeSubmit(pendingFormValues);
			setPendingFormValues(null);
		}
	};

	// 處理改期原因提交
	const handleRescheduleReasonSubmit = async (reason: string) => {
		setRescheduleModalOpen(false);
		if (pendingFormValues) {
			await executeSubmit(pendingFormValues, reason);
			setPendingFormValues(null);
		}
	};

	// 處理取消預約提交
	const handleCancelReservationSubmit = async (reason: string) => {
		setCancelReservationModalOpen(false);
		// TODO: 呼叫取消預約 API
		console.log('取消預約原因:', reason);
		handleCloseModal?.(DialogAction.CONFIRM);
		handleRefresh?.();
	};

	// 執行實際的提交邏輯
	const executeSubmit = async (values: InitialValuesProps, reason?: string) => {
		// Extract orderId - use effectiveOrderId from component state
		const reservationOrderId = effectiveOrderId ||
			(pendingAddMembers.length > 0 ? pendingAddMembers[0].orderMember.orderId : undefined);

		// Extract orderMemberIds from pendingAddMembers
		const reservationOrderMemberIds = pendingAddMembers.map(m => m.orderMemberId);

		// Validate required fields for ADD mode
		if (modalType === ModalType.ADD) {
			if (!reservationOrderId) {
				console.error('Cannot create reservation: orderId is missing');
				return;
			}
			if (reservationOrderMemberIds.length === 0) {
				console.error('Cannot create reservation: no members selected');
				return;
			}
		}

		const reservationData: any = modalType === ModalType.ADD
			? {
				// ADD mode: include orderId and orderMemberIds
				departmentId: values.departmentId,
				classTime: values.courseStartDate!.toDate(),
				teachingLevel: values.courseLevel,
				instructor: values.pickTrainer === 'Y' ? values.trainerName : undefined,
				orderId: reservationOrderId!,
				orderMemberIds: reservationOrderMemberIds,
				...(reason && { reason }),
			} as CreateReservationRequestDto & { reason?: string }
			: {
				// EDIT mode: do not include orderId and orderMemberIds
				departmentId: values.departmentId,
				classTime: values.courseStartDate!.toDate(),
				teachingLevel: values.courseLevel,
				instructor: values.pickTrainer === 'Y' ? values.trainerName : undefined,
				...(reason && { reason }),
			};

		let success = false;
		let newReservationId: string | null = null;

		if (modalType === ModalType.EDIT && reservationId) {
			// 更新模式
			success = await updateExistingReservation(reservationId, reservationData);

			if (success) {
				// 更新成功後，處理成員的新增、刪除和更新
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

				// 3. 更新所有成員的備註和出席狀態
				for (const [memberId, data] of Object.entries(memberNotes)) {
					const updateSuccess = await updateMember(memberId, {
						note: data.note,
						attended: data.attended,
					});
					if (!updateSuccess) {
						console.error(`更新成員 ${memberId} 的備註失敗`);
					}
				}

				// 4. 清空待處理列表
				setPendingAddMembers([]);
				setPendingRemoveMembers([]);

				console.log('成員變更處理完成');
			}
		} else {
			// 建立模式 - Backend automatically creates Reservation, ReservationMembers, and OrderReservation
			newReservationId = await createNewReservation(reservationData);
			success = !!newReservationId;

			if (success) {
				console.log('預約及成員建立成功');
			}
		}

		if (success) {
			handleCloseModal?.(DialogAction.CONFIRM);
			handleRefresh?.();
		}
		// 錯誤處理已經在 hook 中完成
	};

	// 檢查是否已達人數上限
	const isAtCapacity = React.useMemo(() => {
		console.log('檢查人數上限:', { reservationDetail, displayMembersLength: displayMembers.length });
		if (!reservationDetail?.maxStudentCount) return false;
		return displayMembers.length >= reservationDetail.maxStudentCount;
	}, [reservationDetail?.maxStudentCount, displayMembers.length]);

	const isLoading = detailLoading || createLoading || updateLoading || orderDetailLoading || courseDetailLoading;

	// 檢查是否應該禁用基本資訊欄位（待紀錄或已完成狀態）
	const isBasicInfoDisabled = React.useMemo(() => {
		if (modalType !== ModalType.EDIT) return false;
		return (
			reservationDetail?.reservationStatus === ReservationStatus.PENDING_REVIEW ||
			reservationDetail?.reservationStatus === ReservationStatus.COMPLETED
		);
	}, [modalType, reservationDetail?.reservationStatus]);

	// 檢查是否應該禁用所有欄位（已完成狀態）
	const isAllFieldsDisabled = React.useMemo(() => {
		if (modalType !== ModalType.EDIT) return false;
		return reservationDetail?.reservationStatus === ReservationStatus.COMPLETED;
	}, [modalType, reservationDetail?.reservationStatus]);

	return (
		<>
			<Formik
				initialValues={initialValues}
				onSubmit={handleFormSubmit}
				validationSchema={validationSchema}
				enableReinitialize
			>
				{({ isSubmitting, values, setFieldValue }) => {
					// 自動更新授課等級：當成員有變動時
					React.useEffect(() => {
						// 只在有 orderDetail 時處理
						if (!orderDetail) return;

						// 如果是編輯模式且狀態為「待紀錄」或「已完成」，不自動更新授課等級
						if (
							modalType === ModalType.EDIT &&
							(reservationDetail?.reservationStatus === ReservationStatus.PENDING_REVIEW ||
								reservationDetail?.reservationStatus === ReservationStatus.COMPLETED)
						) {
							return;
						}

						// 計算最小等級
						const minLevel = calculateMinLevel(displayMembers);

						if (minLevel !== null) {
							const newCourseLevel = minLevel + 1;
							// 只在等級需要更新時才更新（避免不必要的重渲染）
							if (values.courseLevel !== newCourseLevel.toString()) {
								setFieldValue('courseLevel', newCourseLevel.toString());
								console.log(`授課等級已自動更新為: ${newCourseLevel} (最低成員等級: ${minLevel})`);
							}
						}
					}, [displayMembers, orderDetail, modalType, reservationDetail?.reservationStatus, setFieldValue]);

					return (
						<Form>
							{isLoading || (isSubmitting && <CoreLoaders hasOverlay />)}
							<FormikScrollToError />
							<CoreAnchorModal anchorItems={anchorItems}>
								<CoreBlock
									title='參加成員'
									buttonLabel='加入成員'
									buttonIconType={BtnActionType.ADD}
									buttonDisabled={isAtCapacity || isBasicInfoDisabled}
									handleClick={() => {
										// 判斷是否為預約式團體課
										const isReservationBasedGroupCourse =
											orderDetail?.type === CourseType.GROUP && orderDetail?.bkgType === CourseBkgType.FLEXIBLE;
										console.log(CourseBkgType.FLEXIBLE, '===', orderDetail?.bkgType);

										// 判斷是否為私人課
										const isPrivateCourse = orderDetail?.type === CourseType.PRIVATE;

										// 判斷是否為指定式團體課
										const isDesignatedGroupCourse =
											orderDetail?.type === CourseType.GROUP && orderDetail?.bkgType === CourseBkgType.FIXED;

										console.log(orderDetail?.type, orderDetail?.bkgType);
										console.log({
											isReservationBasedGroupCourse,
											isPrivateCourse,
											isDesignatedGroupCourse,
										});

										modal.openModal({
											title: `加入成員`,
											width: 800,
											height: 600,
											noAction: true,
											noEscAndBackdrop: true,
											children: (
												<AddMemberModal
													searchType='orderMembers'
													onSelectMember={handleSelectMember}
													orderType={isReservationBasedGroupCourse ? orderDetail.type : undefined}
													skiType={isReservationBasedGroupCourse ? orderDetail.skiType : undefined}
													orderNo={isPrivateCourse ? orderDetail.no : undefined}
													coursePlanId={isDesignatedGroupCourse ? orderDetail.coursePlanId : undefined}
													// handleCloseModal={(action) => {
													// 	if (action === 'confirm') {
													// 		modal.closeModal();
													// 	}
													// }}
												/>
											),
										});
									}}
								>
									<MemberList
										members={displayMembers}
										onRemoveMember={isBasicInfoDisabled ? undefined : handleRemoveMember}
										loading={membersLoading}
									/>
								</CoreBlock>
								<CoreBlock
									title='預約資訊'
									buttonLabel='課程資訊'
									buttonIconType={BtnActionType.LINK}
									handleClick={() => {
										console.log('課程資訊');
									}}
								>
									{/* {modalType === ModalType.EDIT &&
									reservationDetail?.linkedOrders &&
									reservationDetail.linkedOrders.length > 1 && (
										<Alert severity='warning' icon={<WarningAmberIcon />} sx={{ mb: 2 }}>
											<AlertTitle>共享預約警告</AlertTitle>
											此預約已連結到 <strong>{reservationDetail.linkedOrders.length} 個訂單</strong>。
											修改此預約將會影響所有連結的訂單。
											<div style={{ marginTop: '8px' }}>
												連結的訂單：
												<ul style={{ margin: '4px 0', paddingLeft: '20px' }}>
													{reservationDetail.linkedOrders.map((order) => (
														<li key={order.orderReservationId}>
															訂單 {order.orderNo} - 第 {order.index + 1} 堂課
														</li>
													))}
												</ul>
											</div>
										</Alert>
									)} */}
									<ReservationInfo
										courseInfo={courseInfo}
										reservationDetail={reservationDetail}
										orderDetail={orderDetail}
										courseDetail={courseDetail}
										displayMembers={displayMembers}
									/>
									<FormikDateTimePicker
										name='courseStartDate'
										title='上課時間'
										isRequired
										placeholder='yyyy/mm/dd hh:mm'
										width='220px'
										format='YYYY/MM/DD hh:mm'
										margin='0 10px 10px 0'
										disabled={isBasicInfoDisabled}
										disablePast
									/>
									<FormikInput
										name='courseLevel'
										title='授課等級'
										width='192px'
										isRequired
										placeholder='1-20'
										disabled={isBasicInfoDisabled}
									/>
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
											disabled={isBasicInfoDisabled}
										/>
										<BlockArea>
											<FormikInput
												name='trainerName'
												title='教練'
												width='320px'
												isRequired={values.pickTrainer === 'Y'}
												placeholder='請輸入教練名字'
												disabled={isBasicInfoDisabled}
											/>
										</BlockArea>
									</Stack>
								</CoreBlock>
								<CoreBlock title='上課紀錄'>
									{modalType === ModalType.ADD && <BlockArea>加入成員紀錄上課情形</BlockArea>}
									{modalType === ModalType.EDIT &&
										savedMembers.map((member) => (
											<NoteBox
												key={member.id}
												member={member}
												note={memberNotes[member.id]?.note || ''}
												attended={memberNotes[member.id]?.attended ?? true}
												onNoteChange={handleNoteChange}
												onAttendedChange={handleAttendedChange}
												disabledAttended={isAllFieldsDisabled}
											/>
										))}
								</CoreBlock>
								<CoreBlock title='預約異動紀錄'>
									<OrderChangesBlock reservationId={reservationId} />
								</CoreBlock>
							</CoreAnchorModal>
							<StyledAbsoluteModalActions
								justifyContent={
									orderDetail?.bkgType === CourseBkgType.FLEXIBLE &&
									orderDetail?.type !== CourseType.GROUP &&
									reservationDetail?.reservationStatus === ReservationStatus.SCHEDULED
										? 'space-between'
										: 'flex-end'
								}
							>
								{orderDetail?.bkgType === CourseBkgType.FLEXIBLE &&
									orderDetail?.type !== CourseType.GROUP &&
									reservationDetail?.reservationStatus === ReservationStatus.SCHEDULED && (
										<CoreButton
											color='error'
											variant='outlined'
											label='取消預約'
											customIcon={<DoDisturbOnOutlinedIcon />}
											onClick={() => setCancelReservationModalOpen(true)}
										/>
									)}
								<Stack direction='row'>
									<CoreButton
										color='default'
										variant='outlined'
										label='關閉'
										onClick={() => handleCloseModal?.(DialogAction.CANCEL)}
										margin='0 12px 0 0'
									/>
									<CoreButton
										color='primary'
										variant='contained'
										type='submit'
										label={modalType === ModalType.EDIT ? '更新' : '建立'}
									/>
								</Stack>
							</StyledAbsoluteModalActions>
						</Form>
					);
				}}
			</Formik>
			<RescheduleReasonModal
				open={rescheduleModalOpen}
				onClose={() => {
					setRescheduleModalOpen(false);
					setPendingFormValues(null);
				}}
				onSubmit={handleRescheduleReasonSubmit}
			/>
			<SubmitAttendanceConfirmModal
				open={submitAttendanceModalOpen}
				onClose={() => {
					setSubmitAttendanceModalOpen(false);
					setPendingFormValues(null);
				}}
				onConfirm={handleSubmitAttendanceConfirm}
			/>
			<CancelReservationModal
				open={cancelReservationModalOpen}
				onClose={() => setCancelReservationModalOpen(false)}
				onSubmit={handleCancelReservationSubmit}
			/>
		</>
	);
};

export default AddEditReservationIndoorModal;
