import React, { useCallback, useEffect, useState } from 'react';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import DoDisturbOnOutlinedIcon from '@mui/icons-material/DoDisturbOnOutlined';
import {
	AttachmentRequestDTO,
	BkgAfterCourseType,
	BkgAfterCourseTypeUnit,
	CourseBkgType,
	CoursePaxLimitType,
	CourseReleaseType,
	CourseRemovalType,
	CourseSkiType,
	CourseStatusType,
	CourseType,
	CreateCoursePlanRequestDto,
	DialogAction,
	GetCoursesResponseDTO,
	getS3MediaUrl,
	HttpStatusCode,
	ModalType,
} from '@repo/shared';
import dayjs from 'dayjs';
import { Form, Formik, FormikProps } from 'formik';

import CoreButton from '@/CIBase/CoreButton';
import CoreLoaders from '@/CIBase/CoreLoaders';
import CoreAnchorModal from '@/CIBase/CoreModal/CoreAnchorModal';
import CoreBlock from '@/CIBase/CoreModal/CoreAnchorModal/CoreBlock';
import { StyledAbsoluteModalActions } from '@/CIBase/CoreModal/CoreModalActions';
import { FormikScrollToError } from '@/Formik/common/FormikComponents';
import useModalProvider from '@/hooks/useModalProvider';
import api from '@/utils/http/api';
import { formSubmitErrorHandler, generalErrorHandler } from '@/utils/http/handler';
import { useLazyRequest, useRequest } from '@/utils/http/hooks';
import { showToast } from '@/utils/ui/general';

import ConfirmUnpublishModal from './PublishUnpublishManagement/ConfirmUnpublishModal';
import BasicSettings from './BasicSettings';
import CancelReservation from './CancelReservation';
import { CancelPolicy } from './CancelReservation';
import CourseInfo from './CourseInfo';
import CourseIntro from './CourseIntro';
import PlanDetails from './PlanDetails';
import PublishUnpublishManagement from './PublishUnpublishManagement';
import { CourseCancelPolicy, CourseDescItem, CoursePeopleItem, InitialValuesProps } from './types';
import { getDraftValidationSchema, getFullValidationSchema } from './validationSchemas';

const anchorItems = [
	{ id: 'basic', label: '基本設定', requireFields: [] },
	{ id: 'courseIntroduce', label: '課程簡介', requireFields: [] },
	{ id: 'planInfo', label: '方案詳情', requireFields: [] },
	{ id: 'courseManage', label: '課程上下架管理', requireFields: [] },
	{ id: 'courseInfo', label: '課程資訊', requireFields: [] },
	{ id: 'cancelReserve', label: '預約取消辦法', requireFields: [] },
];

interface AddEditViewCourseIndoorModalProps {
	handleCloseModal?: (action: DialogAction) => void;
	handleRefresh?: () => void;
	formRef?: React.RefObject<FormikProps<InitialValuesProps>>;
	modalType: ModalType;
	rowData?: GetCoursesResponseDTO;
	courseType: CourseType;
	courseStatusType: CourseStatusType;
	copyFromId?: string;
}

const SEQUENCE_TO_FIELD = {
	1: 'coverImg',
	2: 'otherImg1',
	3: 'otherImg2',
	4: 'otherImg3',
	5: 'otherImg4',
	6: 'otherImg5',
} as const;

const AddEditViewCourseIndoorModal = ({
	modalType,
	courseType,
	courseStatusType,
	handleCloseModal,
	handleRefresh,
	rowData,
	formRef,
	copyFromId,
}: AddEditViewCourseIndoorModalProps) => {
	const modal = useModalProvider();
	const [courseInfo, setCourseInfo] = useState({
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

	const [planList, setPlanList] = useState<CreateCoursePlanRequestDto[]>([]);
	const [coursePeople, setCoursePeople] = useState<CoursePeopleItem[]>([]);
	const [courseTarget, setCourseTarget] = useState<CourseDescItem[]>([{ explanation: '', sequence: 1 }]);
	const [practiceContent, setPracticeContent] = useState<CourseDescItem[]>([{ explanation: '', sequence: 1 }]);
	const [currentAttachments, setCurrentAttachments] = useState<AttachmentRequestDTO[]>([]);

	// --- API ---

	const { data: getCourseDetailData, loading: getCourseDetailLoading } = useRequest(
		() => (copyFromId ? api.getCourseDetail(copyFromId) : rowData?.id ? api.getCourseDetail(rowData.id) : null),
		{
			onError: generalErrorHandler,
		},
	);

	const [createCourseDraft] = useLazyRequest(api.createCourseDraft, {
		onError: formSubmitErrorHandler,
		onSuccess: () => {
			showToast('新增成功', 'success');
			handleCloseModal?.(DialogAction.CONFIRM);
			handleRefresh?.();
		},
	});

	const [updateCourseDraft] = useLazyRequest(api.updateCourseDraft, {
		onError: formSubmitErrorHandler,
		onSuccess: () => {
			showToast('更新成功', 'success');
			handleCloseModal?.(DialogAction.CONFIRM);
			handleRefresh?.();
		},
	});

	const [deleteCourseDraft] = useLazyRequest(api.deleteCourseDraft, {
		onError: generalErrorHandler,
		onSuccess: () => {
			showToast('刪除草稿成功', 'success');
			handleCloseModal?.(DialogAction.CONFIRM);
			handleRefresh?.();
		},
	});

	const [createCourse] = useLazyRequest(api.createCourse, {
		onError: formSubmitErrorHandler,
		onSuccess: () => {
			showToast('新增成功', 'success');
			handleCloseModal?.(DialogAction.CONFIRM);
			handleRefresh?.();
		},
	});

	const [updateCourse] = useLazyRequest(api.updateCourse, {
		onError: formSubmitErrorHandler,
		onSuccess: () => {
			showToast('更新成功', 'success');
			handleCloseModal?.(DialogAction.CONFIRM);
			handleRefresh?.();
		},
	});

	const [revertBackToDraft, { loading: isReverting }] = useLazyRequest(api.revertBackToDraft, {
		onError: (error) => {
			console.error('Error reverting course:', error);
			generalErrorHandler(error);
		},
		onSuccess: () => {
			showToast('取消排程成功，課程已退回草稿狀態', 'success');
			handleCloseModal?.(DialogAction.CONFIRM);
			handleRefresh?.();
		},
	});

	// --- EFFECTS ---

	useEffect(() => {
		if ((modalType === ModalType.EDIT && rowData) || (modalType === ModalType.ADD && copyFromId)) {
			if (getCourseDetailData) {
				// Initialize currentAttachments with existing attachments
				const attachments = getCourseDetailData.result.attachments?.filter((a) => a.id !== null);
				setCurrentAttachments(attachments || []);
				// set planList
				setPlanList(getCourseDetailData.result.coursePlans);
				// Initialize coursePeople with existing data
				setCoursePeople(getCourseDetailData.result.coursePeople || []);
				// Set courseTarget and practiceContent state variables
				const targetItems = getCourseDetailData.result.courseInfos.filter((i) => i.type === 'T');
				const contentItems = getCourseDetailData.result.courseInfos.filter((i) => i.type === 'C');
				setCourseTarget(targetItems.length > 0 ? targetItems : [{ explanation: '', sequence: 1 }]);
				setPracticeContent(contentItems.length > 0 ? contentItems : [{ explanation: '', sequence: 1 }]);
				// Set form values based on coursePeople
				if (getCourseDetailData.result.coursePeople?.length > 0) {
					// Determine if same or different limits
					const hasDifferentTypes = getCourseDetailData.result.coursePeople.some((p) => p.type !== 0);
					if (!hasDifferentTypes) {
						// Same limits for all days
						const people = getCourseDetailData.result.coursePeople[0];
						setInitialValues((prev) => ({
							...prev,
							coursePaxLimit: CoursePaxLimitType.SAME,
							minPeopleEveryday: String(people.minPeople),
							maxPeopleEveryday: String(people.maxPeople),
							...(courseType === CourseType.PRIVATE
								? {
										basePeople: String(people.basePeople || ''),
										addPrice: String(people.addPrice || ''),
									}
								: {}),
						}));
					} else {
						// Different limits for weekdays/weekends
						const weekday = getCourseDetailData.result.coursePeople.find((p) => p.type === 1);
						setInitialValues((prev) => ({
							...prev,
							coursePaxLimit: CoursePaxLimitType.DIFFERENT,
							minPeopleWeekday: String(weekday?.minPeople || ''),
							maxPeopleWeekday: String(weekday?.maxPeople || ''),
							...(courseType === CourseType.PRIVATE
								? {
										basePeople: String(weekday?.basePeople || ''),
										addPrice: String(weekday?.addPrice || ''),
									}
								: {}),
						}));
					}
				}

				setInitialValues((prevState) => ({
					...prevState,
					// 基本設定
					name: getCourseDetailData.result.name + (copyFromId ? '(複製)' : '') || '',
					courseType: getCourseDetailData.result.type,
					courseStatusType: getCourseDetailData.result.status,
					skiType: String(getCourseDetailData.result.skiType),
					// 課程簡介
					description: getCourseDetailData.result.description || '',
					explanation: getCourseDetailData.result.explanation || '',
					...Object.entries(SEQUENCE_TO_FIELD).reduce(
						(acc, [sequence, field]) => ({
							...acc,
							[field]: getImageBySequence(getCourseDetailData.result.attachments, Number(sequence)),
						}),
						{},
					),
					promotion: getCourseDetailData.result.promotion || '',
					// 方案詳情
					bkgType: String(getCourseDetailData.result.bkgType),
					length: String(Number(getCourseDetailData.result.length) / 60), // Convert minutes to hours
					bkgStartDay: getCourseDetailData.result.bkgStartDay ? String(getCourseDetailData.result.bkgStartDay) : '',
					bkgAfterCourse: getCourseDetailData.result.bkgLatestDay
						? String(BkgAfterCourseType.CUSTOM)
						: String(BkgAfterCourseType.UNLIMITED),
					bkgLatestDay: getCourseDetailData.result.bkgLatestDay
						? String(getCourseDetailData.result.bkgLatestDay)
						: undefined,
					bkgLatestDayUnit: String(getCourseDetailData.result.bkgLatestDayUnit || BkgAfterCourseTypeUnit.HOUR),
					// 方案
					coursePlans: getCourseDetailData.result.coursePlans || [],
					// 人數限制條件
					coursePeople: getCourseDetailData.result.coursePeople || [],
					// 每日 (type 0)
					minPeopleEveryday: String(
						getCourseDetailData.result.coursePeople?.find((p) => p.type === 0)?.minPeople || '',
					),
					maxPeopleEveryday: String(
						getCourseDetailData.result.coursePeople?.find((p) => p.type === 0)?.maxPeople || '',
					),
					basePeople: String(getCourseDetailData.result.coursePeople?.find((p) => p.type === 0)?.basePeople || ''),
					addPrice: String(getCourseDetailData.result.coursePeople?.find((p) => p.type === 0)?.addPrice || ''),
					// 平日 (type 1)
					minPeopleWeekday: String(getCourseDetailData.result.coursePeople?.find((p) => p.type === 1)?.minPeople || ''),
					maxPeopleWeekday: String(getCourseDetailData.result.coursePeople?.find((p) => p.type === 1)?.maxPeople || ''),
					// 週末 (type 2)
					minPeopleWeekend: String(getCourseDetailData.result.coursePeople?.find((p) => p.type === 2)?.minPeople || ''),
					maxPeopleWeekend: String(getCourseDetailData.result.coursePeople?.find((p) => p.type === 2)?.maxPeople || ''),
					courseRelease: CourseReleaseType.DESIGNATE,
					courseRemoval: CourseRemovalType.DESIGNATE,
					// Determine coursePaxLimit based on coursePeople types
					coursePaxLimit: getCourseDetailData.result.coursePeople?.some((p) => p.type === 1 || p.type === 2)
						? String(CoursePaxLimitType.DIFFERENT)
						: String(CoursePaxLimitType.SAME),
					// 課程上下架管理
					releaseType: getCourseDetailData.result.releaseType,
					releaseDate: getCourseDetailData.result.releaseDate,
					removalType: getCourseDetailData.result.removalType,
					removalDate: getCourseDetailData.result.removalDate,
					// 課程資訊
					courseTarget: targetItems || [],
					practiceContent: contentItems || [],
					courseFee: getCourseDetailData.result.courseInfos.find((i) => i.type === 'P')?.explanation || '',
					// 確認開課的期限
					checkBefDayRow: '',
					checkBefDay: getCourseDetailData.result.checkBefDay ? String(getCourseDetailData.result.checkBefDay) : '',
					// 預約取消辦法
					hasCancelPolicy: 'N',
					policies: [],
					daysBeforeFree: '',
				}));
				// Process cancel policies if they exist - do this after the main setInitialValues to avoid overriding
				if (
					getCourseDetailData.result.courseCancelPolicies &&
					getCourseDetailData.result.courseCancelPolicies.length > 0
				) {
					// Sort policies by sequence to ensure correct order
					const sortedApiPolicies = [...getCourseDetailData.result.courseCancelPolicies].sort(
						(a, b) => a.sequence - b.sequence,
					);
					// Convert API cancel policies to the format used by the form
					const formattedPolicies: CancelPolicy[] = [];
					// Process policies based on their structure and position
					if (sortedApiPolicies.length > 0) {
						// Check if we have exactly 2 policies with specific structure
						if (sortedApiPolicies.length === 2) {
							const firstPolicy = sortedApiPolicies[0];
							const secondPolicy = sortedApiPolicies[1];
							// Check if first policy has withinDay and price (policy1)
							// and second policy has beforeDay but no withinDay (policy3)
							const firstIsPolicyOne =
								firstPolicy.withinDay !== undefined &&
								firstPolicy.withinDay !== null &&
								String(firstPolicy.withinDay) !== 'null' &&
								firstPolicy.price !== undefined;
							const secondIsPolicyThree =
								secondPolicy.beforeDay !== undefined &&
								secondPolicy.beforeDay !== null &&
								String(secondPolicy.beforeDay) !== 'null' &&
								(secondPolicy.withinDay === undefined ||
									secondPolicy.withinDay === null ||
									String(secondPolicy.withinDay) === 'null');
							// Special case for the data structure you provided
							const isSpecialCase =
								firstPolicy.withinDay !== undefined &&
								String(firstPolicy.withinDay) !== 'null' &&
								(firstPolicy.beforeDay === undefined ||
									firstPolicy.beforeDay === null ||
									String(firstPolicy.beforeDay) === 'null') &&
								secondPolicy.beforeDay !== undefined &&
								String(secondPolicy.beforeDay) !== 'null' &&
								(secondPolicy.withinDay === undefined ||
									secondPolicy.withinDay === null ||
									String(secondPolicy.withinDay) === 'null');
							if ((firstIsPolicyOne && secondIsPolicyThree) || isSpecialCase) {
								// Add policy1
								formattedPolicies.push({
									id: Math.random().toString(36).substring(2, 9),
									type: firstPolicy.type,
									policyType: 1,
									sequence: firstPolicy.sequence,
									withinDay:
										firstPolicy.withinDay !== null && String(firstPolicy.withinDay) !== 'null'
											? String(firstPolicy.withinDay)
											: '',
									price:
										firstPolicy.price !== null && String(firstPolicy.price) !== 'null' ? String(firstPolicy.price) : '',
								});
								// Add policy3
								formattedPolicies.push({
									id: Math.random().toString(36).substring(2, 9),
									type: secondPolicy.type,
									policyType: 3,
									sequence: secondPolicy.sequence,
									beforeDay:
										secondPolicy.beforeDay !== null && String(secondPolicy.beforeDay) !== 'null'
											? String(secondPolicy.beforeDay)
											: '',
								});
								// Set daysBeforeFree from policy3
								if (
									secondPolicy.beforeDay !== undefined &&
									secondPolicy.beforeDay !== null &&
									String(secondPolicy.beforeDay) !== 'null'
								) {
									setInitialValues((prev) => ({
										...prev,
										daysBeforeFree: String(secondPolicy.beforeDay),
									}));
								}
							} else {
								// Process normally if it doesn't match the pattern
								processApiPoliciesNormally();
							}
						} else {
							// Process normally for other cases
							processApiPoliciesNormally();
						}
					}

					// Function to process policies using the normal logic
					function processApiPoliciesNormally() {
						sortedApiPolicies.forEach((policy, index) => {
							// Generate a unique ID for the policy
							const id = Math.random().toString(36).substring(2, 9);
							// Determine policy type based on structure and position
							let policyType: 1 | 2 | 3;
							// Check for null values (convert to undefined for easier checks)
							const beforeDay =
								policy.beforeDay === null || String(policy.beforeDay) === 'null' ? undefined : policy.beforeDay;
							const withinDay =
								policy.withinDay === null || String(policy.withinDay) === 'null' ? undefined : policy.withinDay;
							const price = policy.price === null || String(policy.price) === 'null' ? undefined : policy.price;
							// Policy3 (free change) has only beforeDay and no price
							if (beforeDay !== undefined && withinDay === undefined && price === undefined) {
								policyType = 3;
								// Set daysBeforeFree
								setInitialValues((prev) => ({
									...prev,
									daysBeforeFree: String(beforeDay),
								}));
							}
							// Policy1 is the first item or has only withinDay
							else if (index === 0 || (withinDay !== undefined && beforeDay === undefined)) {
								policyType = 1;
							}
							// Policy2 has both beforeDay and withinDay
							else if (beforeDay !== undefined && withinDay !== undefined) {
								policyType = 2;
							}
							// Default to policy2 for anything else
							else {
								policyType = 2;
							}
							// Create the policy object with proper handling of null values
							const formattedPolicy: CancelPolicy = {
								id,
								type: policy.type,
								policyType,
								sequence: policy.sequence,
								...(beforeDay !== undefined ? { beforeDay: String(beforeDay) } : {}),
								...(withinDay !== undefined ? { withinDay: String(withinDay) } : {}),
								...(price !== undefined ? { price: String(price) } : {}),
							};
							formattedPolicies.push(formattedPolicy);
						});
					}
					// Update the form values with the policies
					setInitialValues((prev) => ({
						...prev,
						hasCancelPolicy: formattedPolicies.length > 0 ? 'Y' : 'N',
						policies: formattedPolicies,
						daysBeforeFree: formattedPolicies.find((p) => p.policyType === 3)?.beforeDay || '',
					}));
				}
			}
			setCourseInfo({
				no: rowData?.no || '--',
				type:
					{
						[CourseType.PRIVATE]: '私人課',
						[CourseType.GROUP]: '團體課',
						[CourseType.INDIVIDUAL]: '個人練習',
					}[rowData?.type] || '--',
				teachingType: rowData?.type === CourseType.INDIVIDUAL ? '無教練授課' : '教練授課',
				status:
					{
						[CourseStatusType.DRAFT]: '草稿',
						[CourseStatusType.PUBLISHED]: '已上架',
						[CourseStatusType.SCHEDULED]: '排程中',
						[CourseStatusType.UNPUBLISHED]: '已下架',
					}[rowData?.status] || '--',
			});
		}
	}, [getCourseDetailData, modalType, rowData, courseType]);

	// --- FORMIK ---

	const [initialValues, setInitialValues] = useState<InitialValuesProps>({
		// 基本設定
		name: '',
		courseType: courseType,
		courseStatusType: courseStatusType,
		skiType: String(CourseSkiType.BOTH),
		// 課程簡介
		description: '',
		explanation: '',
		coverImg: undefined,
		otherImg1: undefined,
		otherImg2: undefined,
		otherImg3: undefined,
		otherImg4: undefined,
		otherImg5: undefined,
		promotion: '',
		// 方案詳情
		bkgType: String(CourseBkgType.FLEXIBLE),
		length: courseType === CourseType.INDIVIDUAL ? '0.5' : '1', // hours
		bkgStartDay: '', // 最快可以預約的課程時間
		bkgAfterCourse: String(BkgAfterCourseType.UNLIMITED),
		bkgLatestDay: undefined,
		bkgLatestDayUnit: BkgAfterCourseTypeUnit.HOUR,
		// 方案
		coursePlans: [],
		// 人數限制條件
		coursePeople: [],
		// 課程上下架管理
		releaseType: CourseReleaseType.DESIGNATE,
		releaseDate: null,
		removalType: CourseRemovalType.DESIGNATE,
		removalDate: null,
		// 課程資訊
		courseTarget: [],
		practiceContent: [],
		courseFee: '',
		// 確認開課的期限
		checkBefDayRow: '',
		checkBefDay: '',
		// 人數限制條件
		// 每日 (type 0)
		minPeopleEveryday: '',
		maxPeopleEveryday: '',
		basePeople: '', // only for 每日
		addPrice: '', // only for 每日
		// 平日 (type 1)
		minPeopleWeekday: '',
		maxPeopleWeekday: '',
		// 週末 (type 2)
		minPeopleWeekend: '',
		maxPeopleWeekend: '',
		coursePaxLimit: CoursePaxLimitType.SAME,
		courseRelease: CourseReleaseType.DESIGNATE,
		courseRemoval: CourseRemovalType.DESIGNATE,
		// 預約取消辦法
		hasCancelPolicy: 'N',
		policies: [],
		daysBeforeFree: '',
	});

	const [isSavingDraft, setIsSavingDraft] = useState(false);
	const [isCreatingCourse, setIsCreatingCourse] = useState(false);
	const [isDebugging, setIsDebugging] = useState(true); // Debug flag

	// Log validation schemas for debugging
	useEffect(() => {
		if (isDebugging) {
			console.log('Current validation schema:', isSavingDraft ? 'Draft Schema' : 'Full Schema');
			console.log('Draft Schema:', getDraftValidationSchema());
			console.log('Full Schema:', getFullValidationSchema(courseType));
		}
	}, [isSavingDraft, courseType, isDebugging]);

	const handleFormSubmit = async (values: InitialValuesProps, modalType: ModalType) => {
		console.log('handleFormSubmit called with', { isCreatingCourse, isSavingDraft, modalType });
		// Helper function to safely format dates
		const formatDate = (date: any) => {
			if (!date || !dayjs(date).isValid()) return null;
			return dayjs(date).hour(0).minute(0).second(0).format('YYYY-MM-DD HH:mm:ss');
		};

		// Helper function to handle successful API response
		const handleSuccess = (message: string) => {
			setIsSavingDraft(false);
			setIsCreatingCourse(false);
		};

		// Prepare the courseCancelPolicies array
		const courseCancelPolicies: CourseCancelPolicy[] = [];
		// Only include cancel policies if hasCancelPolicy is 'Y'
		if (values.hasCancelPolicy === 'Y' && values.policies && values.policies.length > 0) {
			// Sort policies by sequence to ensure correct order
			const sortedPolicies = [...values.policies].sort((a, b) => a.sequence - b.sequence);
			// Map each policy to the required format
			sortedPolicies.forEach((policy) => {
				if (policy.policyType === 1) {
					// Policy one: only needs withinDay and price
					courseCancelPolicies.push({
						type: Number(values.bkgType) || 1, // Use the course booking type
						withinDay: Number(policy.withinDay) || undefined,
						price: Number(policy.price) || undefined,
						sequence: policy.sequence,
					});
				} else if (policy.policyType === 2) {
					// Policy two: needs both beforeDay and withinDay
					courseCancelPolicies.push({
						type: Number(values.bkgType) || 1, // Use the course booking type
						beforeDay: Number(policy.beforeDay) || undefined,
						withinDay: Number(policy.withinDay) || undefined,
						price: Number(policy.price) || undefined,
						sequence: policy.sequence,
					});
				} else if (policy.policyType === 3) {
					// Policy three: only needs beforeDay, no price
					courseCancelPolicies.push({
						type: Number(values.bkgType) || 1, // Use the course booking type
						beforeDay: Number(policy.beforeDay) || undefined,
						sequence: policy.sequence,
					});
				}
			});
		}

		const basePayload = {
			// 目前登入的分店
			departmentId: localStorage.getItem('departmentId') ?? '',
			// 基本設定
			name: values.name,
			type: values.courseType,
			status: copyFromId ? CourseStatusType.DRAFT : values.courseStatusType,
			skiType: Number(values.skiType),
			// 課程簡介
			description: values.description,
			explanation: values.explanation,
			attachments: currentAttachments,
			promotion: values.promotion,
			// 方案詳情
			bkgType: Number(values.bkgType),
			length: Number(values.length) * 60,
			bkgStartDay: Number(values.bkgStartDay),
			// The DTO requires these fields even if null
			bkgLatestDay: Number(values.bkgAfterCourse) === BkgAfterCourseType.CUSTOM ? Number(values.bkgLatestDay) : null,
			bkgLatestDayUnit: Number(values.bkgAfterCourse) === BkgAfterCourseType.CUSTOM ? values.bkgLatestDayUnit : null,
			checkBefDay: Number(values.checkBefDay),
			// 方案
			coursePlans: planList,
			// 人數限制條件
			coursePeople:
				values.coursePaxLimit === CoursePaxLimitType.SAME
					? [
							{
								...(modalType === ModalType.EDIT && getCourseDetailData?.result?.coursePeople?.[0]?.id
									? { id: getCourseDetailData.result.coursePeople[0].id }
									: {}),
								type: 0, // Always use type 0 (每天) for same limits
								minPeople: Number(values.minPeopleEveryday),
								maxPeople: Number(values.maxPeopleEveryday),
								...(courseType === CourseType.PRIVATE
									? {
											basePeople: Number(values.basePeople),
											addPrice: Number(values.addPrice),
										}
									: {}),
							},
						]
					: [
							{
								...(modalType === ModalType.EDIT &&
								getCourseDetailData?.result?.coursePeople?.find((p) => p.type === 1)?.id
									? { id: getCourseDetailData?.result?.coursePeople?.find((p) => p.type === 1)?.id ?? '' }
									: {}),
								type: 1, // 平日
								minPeople: Number(values.minPeopleWeekday),
								maxPeople: Number(values.maxPeopleWeekday),
							},
							{
								...(modalType === ModalType.EDIT &&
								getCourseDetailData?.result?.coursePeople?.find((p) => p.type === 2)?.id
									? { id: getCourseDetailData?.result?.coursePeople?.find((p) => p.type === 2)?.id ?? '' }
									: {}),
								type: 2, // 周末
								minPeople: Number(values.minPeopleWeekend),
								maxPeople: Number(values.maxPeopleWeekend),
							},
						],
			// 課程上下架管理
			releaseType: values.releaseType,
			releaseDate: formatDate(values.releaseDate),
			removalType: values.removalType,
			removalDate: formatDate(values.removalDate),
			// 課程資訊
			courseInfos: [
				// Map courseTarget items (type T)
				...courseTarget.map((item, index) => {
					// Only include id if it's from the database (in edit mode)
					const existingItem =
						modalType === ModalType.EDIT
							? getCourseDetailData?.result?.courseInfos?.find((i) => i.type === 'T' && i.id === item.id)
							: undefined;
					return {
						...(existingItem && existingItem.id ? { id: existingItem.id } : {}),
						type: 'T',
						explanation: item.explanation || '',
						sequence: index + 1, // Start from 1
					};
				}),
				// Map practiceContent items (type C)
				...practiceContent.map((item, index) => {
					// Only include id if it's from the database (in edit mode)
					const existingItem =
						modalType === ModalType.EDIT
							? getCourseDetailData?.result?.courseInfos?.find((i) => i.type === 'C' && i.id === item.id)
							: undefined;
					return {
						...(existingItem && existingItem.id ? { id: existingItem.id } : {}),
						type: 'C',
						explanation: item.explanation || '',
						sequence: courseTarget.length + index + 1, // Continue after courseTarget
					};
				}),
				// Add courseFee as single item (type P)
				{
					...(modalType === ModalType.EDIT && getCourseDetailData?.result?.courseInfos?.find((i) => i.type === 'P')?.id
						? { id: getCourseDetailData.result.courseInfos.find((i) => i.type === 'P')?.id }
						: {}),
					type: 'P',
					explanation: values.courseFee || '',
					sequence: courseTarget.length + practiceContent.length + 1, // Last item
				},
			],
			// Add courseCancelPolicies to the payload
			courseCancelPolicies,
		};

		if (isCreatingCourse) {
			console.log('Creating/updating actual course');
			// Create actual course with required additional fields
			const coursePayload = {
				...basePayload,
				// Required fields for CreateCourseRequestDTO
				teachingType: courseType === CourseType.INDIVIDUAL ? 0 : 1, // 0 for no instructor, 1 with instructor
				paxLimitType: Number(values.coursePaxLimit) || CoursePaxLimitType.SAME,
				cancelable: values.hasCancelPolicy === 'Y', // Boolean instead of number
				sequence: 1,
				// Ensure dates are never null for CreateCourseRequestDTO
				releaseDate: formatDate(values.releaseDate) || '',
				removalDate: formatDate(values.removalDate) || '',
				// Calculate proper status based on release and removal dates
				status: calculateStatus(values.releaseDate, values.removalDate),
				// Required fields must be included even if null
				bkgLatestDay: Number(values.bkgAfterCourse) === BkgAfterCourseType.CUSTOM ? Number(values.bkgLatestDay) : null,
				bkgLatestDayUnit: Number(values.bkgAfterCourse) === BkgAfterCourseType.CUSTOM ? values.bkgLatestDayUnit : null,
				// Ensure coursePeople has required non-undefined properties
				coursePeople: basePayload.coursePeople.map((person) => ({
					...person,
					// Ensure these fields are always numbers, never undefined
					basePeople: typeof person.basePeople === 'number' ? person.basePeople : 0,
					addPrice: typeof person.addPrice === 'number' ? person.addPrice : 0,
				})),
				// Format courseCancelPolicies to ensure all required fields are present
				courseCancelPolicies: courseCancelPolicies.map((policy) => {
					// Create complete policy object with defaults for missing fields
					return {
						...policy,
						beforeDay: typeof policy.beforeDay === 'number' ? policy.beforeDay : 0,
						withinDay: typeof policy.withinDay === 'number' ? policy.withinDay : undefined,
						price: typeof policy.price === 'number' ? policy.price : undefined,
					};
				}),
				// Ensure courseInfos all have non-null explanation
				courseInfos: basePayload.courseInfos.map((info) => ({
					...info,
					explanation: info.explanation || '',
				})),
			};

			if (modalType === ModalType.EDIT && rowData?.id) {
				// Update existing course
				console.log('Updating existing course with ID:', rowData.id);
				const { statusCode } = await updateCourse({ ...coursePayload, id: rowData.id });
				if (statusCode === HttpStatusCode.OK) {
					handleSuccess('更新課程成功');
				}
			} else {
				// Create new course
				console.log('Creating new course');
				const { statusCode } = await createCourse(coursePayload);
				if (statusCode === HttpStatusCode.OK) {
					handleSuccess('建立課程成功');
				}
			}
		} else {
			// Save as draft
			const { statusCode } = await (modalType === ModalType.ADD || !rowData?.id
				? createCourseDraft(basePayload)
				: updateCourseDraft({ ...basePayload, id: rowData.id }));
			if (statusCode === HttpStatusCode.OK) {
				handleSuccess(isSavingDraft ? '儲存草稿成功' : '操作成功');
			}
		}
	};

	const handleUpdatePlan = (updatedPlanList: CreateCoursePlanRequestDto[]) => {
		const cleanedPlanList = updatedPlanList.map((plan) => {
			const { id, ...rest } = plan;
			return id ? { id, ...rest } : rest;
		});
		setPlanList(cleanedPlanList);

		// Also update the Formik field to keep it in sync
		if (formRef && formRef.current) {
			formRef.current.setFieldValue('coursePlans', cleanedPlanList);
		}
	};

	const handleUpdateCoursePeople = (updatedCoursePeople: CoursePeopleItem[]) => {
		setCoursePeople(updatedCoursePeople);
	};

	// Helper function to get image URL if it exists
	const getImageIfExists = (attachment?: { key?: string }) =>
		attachment?.key ? getS3MediaUrl(attachment.key) : undefined;

	// Helper function to get image by sequence
	const getImageBySequence = (attachments: any[], sequence: number) => {
		const attachment = attachments?.find((a) => a.sequence === sequence);
		return attachment ? getImageIfExists(attachment) : undefined;
	};

	const handleAttachmentsUpdate = useCallback((newAttachments: AttachmentRequestDTO[]) => {
		setCurrentAttachments(newAttachments);
	}, []);

	// Helper function to calculate status based on release and removal dates
	const calculateStatus = (releaseDate: string | null, removalDate: string | null): CourseStatusType => {
		const now = dayjs();
		const release = releaseDate ? dayjs(releaseDate) : null;
		const removal = removalDate ? dayjs(removalDate) : null;

		// Status 1: 排程中 (Scheduled) - Before releaseDate
		// Status 2: 已上架 (Published) - Between releaseDate and removalDate
		// Status 3: 已下架 (Unpublished) - After removalDate

		if (release && now.isBefore(release)) {
			// If current time is before releaseDate, status is "Scheduled"
			return CourseStatusType.SCHEDULED;
		} else if (removal && now.isAfter(removal)) {
			// If current time is after removalDate, status is "Unpublished"
			return CourseStatusType.UNPUBLISHED;
		} else {
			// If current time is between releaseDate and removalDate (or releaseDate is null), status is "Published"
			return CourseStatusType.PUBLISHED;
		}
	};

	return (
		<Formik
			initialValues={initialValues}
			onSubmit={(values, { setSubmitting }) => {
				console.log('Formik onSubmit called', { isCreatingCourse, isSavingDraft });
				return handleFormSubmit(values, modalType).then(() => setSubmitting(false));
			}}
			validationSchema={isSavingDraft ? getDraftValidationSchema() : getFullValidationSchema(courseType)}
			enableReinitialize
			innerRef={formRef}
			validate={(values) => {
				// Additional form-level validation
				const errors: Record<string, any> = {};
				console.log('Formik validate called', { isSavingDraft, isCreatingCourse });

				// Skip validation when saving as draft
				if (isSavingDraft) {
					console.log('Skipping validation for draft');
					return errors;
				}

				// Check courseTarget explanations
				if (courseTarget.some((item) => !item.explanation || item.explanation.trim() === '')) {
					errors.courseTarget = '課程對象必填欄位';
				}

				// Check practiceContent explanations
				if (practiceContent.some((item) => !item.explanation || item.explanation.trim() === '')) {
					errors.practiceContent = '練習內容必填欄位';
				}

				// Manually check planList and ensure it's synced with coursePlans
				if (planList.length > 0 && (!values.coursePlans || values.coursePlans.length === 0)) {
					// We have plans in planList but not in the form values, update it
					if (formRef && formRef.current) {
						console.log('Fixing coursePlans in validate function');
						setTimeout(() => {
							formRef.current?.setFieldValue('coursePlans', planList);
						}, 0);
					}
				}

				// For validation, we need to test if the schema would pass with the actual planList
				// instead of the coursePlans field which might be out of sync
				if (planList.length === 0) {
					errors.coursePlans = '請新增至少一個方案';
				}

				console.log('Validation errors:', errors);
				return errors;
			}}
		>
			{({ isSubmitting, values, errors, submitCount, isValid, dirty, submitForm }) => {
				console.log('Formik render state:', { isSubmitting, submitCount, isValid, dirty, errors });
				return (
					<Form>
						{(getCourseDetailLoading || isSubmitting) && <CoreLoaders hasOverlay />}
						<FormikScrollToError />
						<CoreAnchorModal anchorItems={anchorItems}>
							<CoreBlock title='基本設定'>
								<BasicSettings courseInfo={courseInfo} courseStatusType={courseStatusType} courseType={courseType} />
							</CoreBlock>
							<CoreBlock title='課程簡介'>
								<CourseIntro
									onAttachmentsUpdate={handleAttachmentsUpdate}
									initialAttachments={getCourseDetailData?.result?.attachments ?? []}
									courseStatusType={courseStatusType}
								/>
							</CoreBlock>
							<CoreBlock title='方案詳情'>
								<PlanDetails
									courseType={courseType}
									planList={planList}
									updatePlanList={handleUpdatePlan}
									coursePeople={coursePeople}
									updateCoursePeople={handleUpdateCoursePeople}
									hasSubmitted={submitCount > 0}
									isSavingDraft={isSavingDraft}
									courseStatusType={courseStatusType}
								/>
							</CoreBlock>
							<CoreBlock title='課程上下架管理'>
								<PublishUnpublishManagement courseStatusType={courseStatusType} courseBkgType={values.bkgType} />
							</CoreBlock>
							<CoreBlock title='課程資訊'>
								<CourseInfo
									courseTarget={courseTarget}
									setCourseTarget={setCourseTarget}
									practiceContent={practiceContent}
									setPracticeContent={setPracticeContent}
									hasErrors={submitCount > 0 && (!!errors.courseTarget || !!errors.practiceContent)}
									isSavingDraft={isSavingDraft}
									courseStatusType={courseStatusType}
								/>
							</CoreBlock>
							<CoreBlock title='預約取消辦法'>
								<CancelReservation
									hasCancelPolicy={values.hasCancelPolicy}
									policies={values.policies || []}
									daysBeforeFree={values.daysBeforeFree}
									hasSubmitted={submitCount > 0}
									isSavingDraft={isSavingDraft}
									courseStatusType={courseStatusType}
								/>
							</CoreBlock>
						</CoreAnchorModal>
						<StyledAbsoluteModalActions justifyContent='space-between'>
							{/* Left side */}
							<div>
								{modalType === ModalType.EDIT && rowData && (
									<>
										{courseStatusType === CourseStatusType.SCHEDULED && (
											<CoreButton
												color='error'
												variant='text'
												label='取消排程'
												customIcon={<DoDisturbOnOutlinedIcon />}
												onClick={() => rowData?.id && revertBackToDraft({ courseId: rowData.id })}
												margin='0 12px 0 0'
											/>
										)}
										{courseStatusType === CourseStatusType.PUBLISHED && (
											<CoreButton
												color='error'
												variant='text'
												label='立即下架'
												customIcon={<DoDisturbOnOutlinedIcon />}
												onClick={() => {
													modal.openModal({
														title: `下架課程`,
														width: 480,
														height: 114,
														noEscAndBackdrop: true,
														noTitleBorder: true,
														noCancel: true,
														noAction: true,
														children: (
															<ConfirmUnpublishModal
																courseId={rowData?.id}
																handleCloseModal={(action) => {
																	if (action === DialogAction.CONFIRM) {
																		handleRefresh?.();
																		handleCloseModal?.(DialogAction.CANCEL);
																	}
																}}
																onSuccess={handleRefresh}
															/>
														),
													});
												}}
												margin='0 12px 0 0'
											/>
										)}
										{courseStatusType === CourseStatusType.DRAFT && (
											<CoreButton
												color='error'
												variant='text'
												label='刪除'
												iconType='delete'
												onClick={() => deleteCourseDraft({ draftId: rowData.id })}
											/>
										)}
										{courseStatusType === CourseStatusType.UNPUBLISHED && (
											<CoreButton
												color='primary'
												variant='text'
												label='複製課程'
												customIcon={<ContentCopyOutlinedIcon />}
												onClick={() => {
													if (!rowData?.id) {
														showToast('課程ID不存在', 'error');
														return;
													}

													handleCloseModal?.(DialogAction.CANCEL);
													modal.openModal({
														title: `複製課程`,
														center: true,
														fullScreen: true,
														noAction: true,
														marginBottom: true,
														children: (
															<AddEditViewCourseIndoorModal
																modalType={ModalType.ADD}
																courseType={courseType}
																courseStatusType={CourseStatusType.DRAFT}
																handleRefresh={handleRefresh}
																// Special flag for copy operation with original ID
																rowData={{
																	...rowData,
																	// Clear these fields to ensure it's a new course
																	id: '',
																	status: CourseStatusType.DRAFT,
																	no: '',
																}}
																copyFromId={rowData.id}
															/>
														),
													});
												}}
												margin='0 12px 0 0'
											/>
										)}
									</>
								)}
							</div>
							{/* Right side */}
							<div style={{ display: 'flex', gap: '12px' }}>
								{/* Basic buttons */}
								{courseStatusType !== CourseStatusType.UNPUBLISHED && (
									<CoreButton
										color='default'
										variant='outlined'
										label='取消'
										onClick={() => handleCloseModal?.(DialogAction.CANCEL)}
									/>
								)}
								{courseStatusType === CourseStatusType.DRAFT && (
									<CoreButton
										color='default'
										variant='outlined'
										label='儲存為草稿'
										onClick={() => {
											console.log('Save as Draft clicked');
											setIsSavingDraft(true);
											setIsCreatingCourse(false);
											// Use setTimeout to ensure state is updated before validation runs
											setTimeout(() => {
												// Access Formik's submitForm method through the formRef
												console.log('Attempting to submit form as draft');
												if (formRef && formRef.current) {
													console.log('FormRef exists, calling submitForm');
													formRef.current.submitForm();
												} else {
													console.log('FormRef missing, cannot submit form');
												}
											}, 0);
										}}
									/>
								)}
								{courseStatusType !== CourseStatusType.UNPUBLISHED && (
									<CoreButton
										color='primary'
										variant='contained'
										label={modalType === ModalType.EDIT ? '確認' : '確認排程'}
										onClick={() => {
											console.log('Confirm button clicked');
											setIsCreatingCourse(true);
											setIsSavingDraft(false);
											// Use setTimeout to ensure state is updated before validation runs
											setTimeout(() => {
												// Access Formik's submitForm method through the formRef
												console.log('Attempting to submit form to create course');
												if (formRef && formRef.current) {
													console.log('FormRef exists, calling submitForm');
													formRef.current.submitForm();
												} else {
													console.log('FormRef missing, cannot submit form');
												}
											}, 0);
										}}
									/>
								)}
								{courseStatusType === CourseStatusType.UNPUBLISHED && (
									<CoreButton
										color='primary'
										variant='contained'
										label='關閉'
										onClick={() => handleCloseModal?.(DialogAction.CANCEL)}
									/>
								)}
							</div>
						</StyledAbsoluteModalActions>
					</Form>
				);
			}}
		</Formik>
	);
};

export default AddEditViewCourseIndoorModal;
