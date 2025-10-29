import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { AttachmentDeviceType, AttachmentRequestDTO, DialogAction, HttpStatusCode } from '@repo/shared';
import { Form, Formik, FormikProps } from 'formik';
import * as Yup from 'yup';

import CoreButton from '@/CIBase/CoreButton';
import CoreLoaders from '@/CIBase/CoreLoaders';
import CoreAnchorModal from '@/CIBase/CoreModal/CoreAnchorModal';
import CoreBlock from '@/CIBase/CoreModal/CoreAnchorModal/CoreBlock';
import CoreBlockRow from '@/CIBase/CoreModal/CoreAnchorModal/CoreBlockRow';
import { StyledAbsoluteModalActions } from '@/CIBase/CoreModal/CoreModalActions';
import { FormikScrollToError } from '@/Formik/common/FormikComponents';
import FormikFileUploadImage, { UploadImageWrapper, yupImageCheck } from '@/Formik/FormikFileUploadImage';
import FormikSelect from '@/Formik/FormikSelect';
import { getS3MediaUrl } from '@/utils/general';
import api from '@/utils/http/api';
import { generalErrorHandler } from '@/utils/http/handler';
import { useLazyRequest, useRequest } from '@/utils/http/hooks';
import { showToast } from '@/utils/ui/general';

const anchorItems = [{ id: 'banner', label: '單幅廣告', requireFields: [] }];

interface InitialValuesProps {
	bannerDesktop: string;
	bannerMobile: string;
	buttonUrl: string;
}

interface ManageBannerModalProps {
	handleCloseModal?: (action: DialogAction) => void;
	handleRefresh?: () => void;
	formRef?: React.RefObject<FormikProps<InitialValuesProps>>;
}

const ManageBannerModal = ({ handleCloseModal, handleRefresh }: ManageBannerModalProps) => {
	const [attachments, setAttachments] = useState<AttachmentRequestDTO[]>([
		{
			key: '',
			originalName: '',
			mediaType: '',
			deviceType: AttachmentDeviceType.DESKTOP,
			sequence: 1,
		},
		{
			key: '',
			originalName: '',
			mediaType: '',
			deviceType: AttachmentDeviceType.MOBILE,
			sequence: 1,
		},
	]);

	// --- API ---

	const { data: getHomeBannerData } = useRequest(() => api.getHomeBanner(), {
		onError: generalErrorHandler,
	});

	const [updateHomeBanner, { loading: updateHomeBannerLoading }] = useLazyRequest(api.updateHomeBanner, {
		onError: generalErrorHandler,
		onSuccess: () => showToast(`已更新`, 'success'),
	});

	// --- COURSE OPTIONS STATE ---

	const [courseOptions, setCourseOptions] = useState<Array<{ label: string; value: string }>>([]);
	const [coursesLoading, setCoursesLoading] = useState(false);
	const [departmentId, setDepartmentId] = useState<string>('');

	// --- FETCH COURSES ---

	useEffect(() => {
		// 從 localStorage 讀取當前選擇的部門 ID
		const storedDepartmentId = localStorage.getItem('departmentId');
		if (storedDepartmentId) {
			setDepartmentId(storedDepartmentId);
		}
	}, []);

	useEffect(() => {
		const fetchCourses = async () => {
			if (!departmentId) {
				return;
			}

			try {
				setCoursesLoading(true);
				const response = await api.getCoursePublishedList({ departmentId });

				// 後端直接返回陣列，或者包裝在 ResponseWrapper 中
				let courseList: any[] = [];

				if (Array.isArray(response)) {
					// 如果 response 本身是陣列
					courseList = response;
				} else if (Array.isArray(response.result)) {
					// 如果 response.result 是陣列
					courseList = response.result;
				} else if (response.result) {
					// 如果 response.result 是單個對象
					courseList = [response.result];
				}

				// 轉換課程資料為 FormikSelect 需要的格式
				const options = courseList.map((course) => ({
					label: course.name,
					value: `/courses/course-detail?id=${course.id}`,
				}));

				setCourseOptions(options);
			} catch (err) {
				if (err instanceof Error) {
					generalErrorHandler(err);
				}
			} finally {
				setCoursesLoading(false);
			}
		};

		if (departmentId) {
			fetchCourses();
		}
	}, [departmentId]);

	// --- FORMIK ---

	const [initialValues, setInitialValues] = useState<InitialValuesProps>({
		bannerDesktop: '',
		bannerMobile: '',
		buttonUrl: '',
	});

	useEffect(() => {
		if (getHomeBannerData?.result) {
			setInitialValues({
				bannerDesktop: getS3MediaUrl(getHomeBannerData.result.desktop?.url ?? ''),
				bannerMobile: getS3MediaUrl(getHomeBannerData.result.mobile?.url ?? ''),
				buttonUrl: getHomeBannerData.result.buttonUrl ?? '',
			});

			setAttachments([
				{
					key: getHomeBannerData.result.desktop?.url ?? '',
					originalName: getHomeBannerData.result.desktop?.originalName ?? '',
					mediaType: getHomeBannerData.result.desktop?.mediaType ?? '',
					deviceType: AttachmentDeviceType.DESKTOP,
					sequence: 1,
				},
				{
					key: getHomeBannerData.result.mobile?.url ?? '',
					originalName: getHomeBannerData.result.mobile?.originalName ?? '',
					mediaType: getHomeBannerData.result.mobile?.mediaType ?? '',
					deviceType: AttachmentDeviceType.MOBILE,
					sequence: 1,
				},
			]);
		}
	}, [getHomeBannerData]);

	const validationSchema = Yup.object().shape({
		bannerDesktop: yupImageCheck(true),
		bannerMobile: yupImageCheck(true),
		buttonUrl: Yup.string().required('必填欄位'),
	});

	// --- FUNCTIONS ---

	const handleFormSubmit = async (values: InitialValuesProps) => {
		const { statusCode } = await updateHomeBanner({
			buttonUrl: values.buttonUrl,
			attachments,
		});

		if (statusCode === HttpStatusCode.OK) {
			handleCloseModal?.(DialogAction.CONFIRM);
			handleRefresh?.();
		}
	};

	const isLoading = updateHomeBannerLoading;

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
							<CoreBlock title='單幅廣告'>
								<CoreBlockRow>
									<UploadImageWrapper title='圖片' width='100%' isRequired>
										<FormikFileUploadImage
											name='bannerDesktop'
											description='桌機使用 1800x540'
											aspectType='banner_desktop'
											hasPreview
											onUploadComplete={(uploadedFileUrl, fileInfo) => {
												if (!uploadedFileUrl) return;

												setAttachments((preState) =>
													preState.map((x) => {
														if (x.deviceType === AttachmentDeviceType.DESKTOP) {
															return {
																...x,
																key: uploadedFileUrl.split('/').pop() ?? '',
																originalName: fileInfo?.name ?? '',
																mediaType: fileInfo?.type ?? '',
															};
														}
														return x;
													}),
												);
											}}
										/>
										<FormikFileUploadImage
											name='bannerMobile'
											description='手機使用 750x880'
											aspectType='banner_mobile'
											hasPreview
											onUploadComplete={(uploadedFileUrl, fileInfo) => {
												if (!uploadedFileUrl) return;

												setAttachments((preState) =>
													preState.map((x) => {
														if (x.deviceType === AttachmentDeviceType.MOBILE) {
															return {
																...x,
																key: uploadedFileUrl.split('/').pop() ?? '',
																originalName: fileInfo?.name ?? '',
																mediaType: fileInfo?.type ?? '',
															};
														}
														return x;
													}),
												);
											}}
										/>
									</UploadImageWrapper>
								</CoreBlockRow>
								<CoreBlockRow>
									<Box display='flex' flexDirection='column' width='100%'>
										<FormikSelect
											name='buttonUrl'
											title='點擊按鈕連結的課程'
											placeholder='選擇'
											options={courseOptions}
											width='100%'
											disabled={coursesLoading}
										/>
									</Box>
								</CoreBlockRow>
							</CoreBlock>
						</CoreAnchorModal>
						<StyledAbsoluteModalActions justifyContent='flex-end'>
							<CoreButton
								color='default'
								variant='outlined'
								label='取消'
								onClick={() => handleCloseModal?.(DialogAction.CANCEL)}
								margin='0 12px 0 0'
							/>
							<CoreButton
								color='primary'
								variant='contained'
								type='submit'
								label='確認'
								onClick={() => console.log(values)}
							/>
						</StyledAbsoluteModalActions>
					</Form>
				);
			}}
		</Formik>
	);
};

export default ManageBannerModal;
