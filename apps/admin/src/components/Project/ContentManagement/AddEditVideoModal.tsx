import React, { useEffect, useState } from 'react';
import { DialogAction, GetHomeVideoResponseDTO, ModalType } from '@repo/shared';
import { Form, Formik, FormikProps } from 'formik';
import * as Yup from 'yup';

import CoreButton from '@/CIBase/CoreButton';
import CoreLoaders from '@/CIBase/CoreLoaders';
import { StyledAbsoluteModalActions } from '@/CIBase/CoreModal/CoreModalActions';
import CoreModalContent from '@/CIBase/CoreModal/ModalContent';
import { FormikScrollToError } from '@/Formik/common/FormikComponents';
import FormikInput from '@/Formik/FormikInput';
import FormikSelect from '@/Formik/FormikSelect';
import FormikYoutubeThumbnail from '@/Formik/FormikYoutubeThumbnail';
import { youtubeRegex } from '@/hooks/useGetYoutubeImage';
import api from '@/utils/http/api';
import { generalErrorHandler } from '@/utils/http/handler';

interface InitialValuesProps extends GetHomeVideoResponseDTO {
	currentEditIndex: number;
}

interface AddEditVideoModalProps {
	currentEditIndex: number;
	rowData: GetHomeVideoResponseDTO;
	handleCloseModal?: (action: DialogAction) => void;
	handleRefresh?: () => void;
	modalType: ModalType;
	formRef?: React.RefObject<FormikProps<InitialValuesProps>>;
	handleDelete?: (currentEditIndex: number) => void;
	handleConfirm: (currentVideoData: InitialValuesProps) => void;
}

const AddEditVideoModal = ({
	currentEditIndex,
	handleCloseModal,
	modalType,
	rowData,
	formRef,
	handleDelete,
	handleConfirm,
}: AddEditVideoModalProps) => {
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

	// --- EFFECTS ---

	useEffect(() => {
		setInitialValues({
			...rowData,
			currentEditIndex,
		});
	}, [currentEditIndex, rowData]);

	// --- FORMIK ---

	const [initialValues, setInitialValues] = useState<InitialValuesProps>({
		id: '',
		name: '',
		url: '',
		buttonName: '',
		buttonUrl: '',
		sort: 0,
		currentEditIndex,
	});

	const validationSchema = Yup.object().shape({
		name: Yup.string().required('必填欄位'),
		url: Yup.string()
			.test('checkURL', '影片網址無效', (value) => youtubeRegex.test(value as string))
			.required('必填欄位'),
		buttonName: Yup.string().max(6, '按鈕名稱最多6個字').required('必填欄位'),
		buttonUrl: Yup.string().required('必填欄位'),
	});

	const handleOnSubmit = async (values: InitialValuesProps) => {
		handleConfirm(values);
		handleCloseModal?.(DialogAction.CONFIRM);
	};

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
					{isSubmitting && <CoreLoaders hasOverlay />}
					<FormikScrollToError />
					<CoreModalContent padding='24px 0'>
						<FormikYoutubeThumbnail
							name='url'
							title='Youtube影片URL'
							placeholder='輸入'
							isRequired
							width='100%'
							margin='0 0 24px 0'
						/>

						<FormikInput
							name='buttonName'
							title='按鈕名稱'
							placeholder='輸入'
							disabled={modalType === ModalType.VIEW}
							isRequired
							width='100%'
							margin='0 0 24px 0'
							hasTextCountAdornment
							textCount={values.buttonName.length}
							maxTextCount={6}
						/>

						<FormikSelect
							name='buttonUrl'
							placeholder='選擇'
							options={courseOptions}
							isRequired
							width='100%'
							menuPortal
							title='點擊按鈕連結的課程'
							maxMenuHeight={150}
							disabled={modalType === ModalType.VIEW || coursesLoading}
						/>
					</CoreModalContent>
					<StyledAbsoluteModalActions justifyContent={modalType === ModalType.ADD ? 'flex-end' : 'space-between'}>
						{modalType === ModalType.EDIT && (
							<CoreButton
								variant='text'
								iconType='delete'
								color='error'
								label='刪除'
								onClick={() => {
									handleDelete?.(values.currentEditIndex);
									handleCloseModal?.(DialogAction.CANCEL);
								}}
							/>
						)}

						<div>
							<CoreButton
								variant='outlined'
								label='取消'
								onClick={() => handleCloseModal?.(DialogAction.CANCEL)}
								margin='0 12px 0 0'
							/>
							<CoreButton color='primary' variant='contained' type='submit' label='確認' />
						</div>
					</StyledAbsoluteModalActions>
				</Form>
			)}
		</Formik>
	);
};

export default AddEditVideoModal;
