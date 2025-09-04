import React, { useEffect, useState } from 'react';
import { Box, Stack } from '@mui/material';
import {
	CourseBkgType,
	CoursePlanType,
	CourseType,
	CreateCoursePlanRequestDto,
	CreateCoursePlanSessionRequestDto,
	DialogAction,
	ModalType,
} from '@repo/shared';
import dayjs from 'dayjs';
import { Form, Formik, FormikProps } from 'formik';
import * as Yup from 'yup';

import CoreButton from '@/CIBase/CoreButton';
import CoreLoaders from '@/CIBase/CoreLoaders';
import { StyledAbsoluteModalActions } from '@/CIBase/CoreModal/CoreModalActions';
import CoreModalContent from '@/CIBase/CoreModal/ModalContent';
import FormikDateTimePicker from '@/CIBase/Formik/FormikDateTimePicker';
import FormikRadio from '@/CIBase/Formik/FormikRadio';
import { FormikScrollToError } from '@/Formik/common/FormikComponents';
import FormikInput from '@/Formik/FormikInput';

import * as Components from '../../../shared/Components';

const tableHeader = [
	{ label: '課程', width: '80px' },
	{ label: '開始上課時間', width: '250px' },
	{ label: ' ', width: '100px' },
];

export interface PlanProps {
	id?: string;
	name: string;
	type: string;
	number: string;
	price: string;
	promotionType?: string;
	promotion?: string;
	sessions?: { no: number; startTime: string; endTime: string }[];
	[key: string]: any; // Allow dynamic session fields
}

interface AddEditPlanModalProps {
	handleCloseModal?: (action: DialogAction) => void;
	handleRefresh?: () => void;
	formRef?: React.RefObject<FormikProps<PlanProps>>;
	modalType: ModalType;
	courseType: CourseType;
	bkgType: CourseBkgType;
	planList: CreateCoursePlanRequestDto[];
	updatePlanList: (planList: CreateCoursePlanRequestDto[]) => void;
	rowData?: CreateCoursePlanRequestDto;
	disabled?: boolean;
}

const AddEditPlanModal = ({
	handleCloseModal,
	handleRefresh,
	modalType,
	bkgType,
	courseType,
	planList,
	updatePlanList,
	rowData,
	disabled = false,
}: AddEditPlanModalProps) => {
	// Determine if form should be read-only based on modalType
	const isViewMode = modalType === ModalType.VIEW || disabled;

	// console.log({ bkgType, courseType });
	// --- API ---

	// --- EFFECTS ---

	useEffect(() => {}, []);

	// Function to extract session data from rowData
	const getInitialSessions = (sessions?: CreateCoursePlanSessionRequestDto[]): Record<string, string> => {
		if (!sessions || !sessions.length) return {};

		const sessionValues: Record<string, string> = {};
		sessions.forEach((session) => {
			// Convert startTime to string format for the DateTimePicker
			const startTimeStr =
				typeof session.startTime === 'string'
					? session.startTime
					: session.startTime instanceof Date
						? session.startTime.toISOString()
						: String(session.startTime);

			sessionValues[`courseSession${session.no}`] = dayjs(startTimeStr).format('YYYY-MM-DD HH:mm');
		});

		return sessionValues;
	};

	// --- FORMIK ---

	const [initialValues, setInitialValues] = useState<PlanProps>({
		name: (modalType === ModalType.EDIT || modalType === ModalType.VIEW) && rowData ? rowData.name : '',
		type:
			(modalType === ModalType.EDIT || modalType === ModalType.VIEW) && rowData
				? String(rowData.type)
				: bkgType === CourseBkgType.FIXED
					? String(CoursePlanType.NONE)
					: courseType === CourseType.GROUP
						? String(CoursePlanType.FIXED_SESSION)
						: courseType === CourseType.PRIVATE
							? String(CoursePlanType.PRIVATE_SESSION)
							: String(CoursePlanType.NONE),
		number: (modalType === ModalType.EDIT || modalType === ModalType.VIEW) && rowData ? String(rowData.number) : '',
		price: (modalType === ModalType.EDIT || modalType === ModalType.VIEW) && rowData ? String(rowData.price) : '',
		promotionType: (modalType === ModalType.EDIT || modalType === ModalType.VIEW) && rowData?.promotion ? '1' : '0',
		promotion: (modalType === ModalType.EDIT || modalType === ModalType.VIEW) && rowData ? rowData.promotion : '',
		...((modalType === ModalType.EDIT || modalType === ModalType.VIEW) && rowData?.sessions
			? getInitialSessions(rowData.sessions)
			: {}),
	});

	// Create validation schema with dynamic session fields
	const getValidationSchema = (values: PlanProps) => {
		const baseSchema: Record<string, any> = {
			name: Yup.string().required('必填欄位'),
			type: Yup.string().required('必填欄位'),
			number: Yup.string().required('必填欄位'),
			price: Yup.string().required('必填欄位'),
			promotionType: Yup.string().required('必填欄位'),
			promotion: Yup.string().when('promotionType', ([value]) => {
				return value === '1' ? Yup.string().required('必填欄位') : Yup.string();
			}),
		};

		// Add validation for session fields when booking type is FIXED
		if (bkgType === CourseBkgType.FIXED && values && values.number) {
			const sessionCount = Number(values.number);
			if (!isNaN(sessionCount) && sessionCount > 0) {
				for (let i = 1; i <= sessionCount; i++) {
					baseSchema[`courseSession${i}`] = Yup.string().required('必填欄位');
				}
			}
		}

		return Yup.object().shape(baseSchema);
	};

	// Use a dynamic validation schema that adjusts based on the current values
	const validationSchema = Yup.lazy((values: PlanProps) => {
		return getValidationSchema(values);
	});

	const handleFormSubmit = async (values: PlanProps) => {
		try {
			let sessionList: CreateCoursePlanSessionRequestDto[] = [];

			// Create session objects when booking type is FIXED
			if (bkgType === CourseBkgType.FIXED && values && values.number) {
				const sessionCount = Number(values.number);

				if (!isNaN(sessionCount) && sessionCount > 0) {
					for (let i = 1; i <= sessionCount; i++) {
						const sessionFieldName = `courseSession${i}`;
						const startTimeValue = values[sessionFieldName];

						if (startTimeValue) {
							try {
								// Parse start time and calculate end time (1 hour later)
								const startTime = dayjs(startTimeValue);
								if (startTime.isValid()) {
									const endTime = startTime.add(1, 'hour');

									sessionList.push({
										no: i,
										startTime: startTime.format('YYYY-MM-DDTHH:mm:00Z'),
										endTime: endTime.format('YYYY-MM-DDTHH:mm:00Z'),
									} as unknown as CreateCoursePlanSessionRequestDto);
								}
							} catch (error) {
								console.error(`Error processing session ${i}:`, error);
							}
						}
					}
				}
			}

			const coursePlanRequestDTO: CreateCoursePlanRequestDto = {
				name: values.name,
				type: Number(values.type),
				price: Number(values.price),
				number: Number(values.number),
				promotion: values.promotionType === '1' ? values.promotion : '',
				id: modalType === ModalType.EDIT && rowData ? rowData.id : '',
				sequence:
					modalType === ModalType.EDIT && rowData
						? rowData.sequence
						: planList.length > 0
							? Math.max(...planList.map((plan) => plan.sequence)) + 1
							: 1,
				suggestion: modalType === ModalType.EDIT && rowData ? rowData.suggestion : false,
				sessions: bkgType === CourseBkgType.FIXED ? sessionList : [],
			};

			if (modalType === ModalType.EDIT) {
				// For editing, we'll use the sequence to identify the plan
				updatePlanList(planList.map((plan) => (plan.sequence === rowData?.sequence ? coursePlanRequestDTO : plan)));
			} else {
				updatePlanList([...planList, coursePlanRequestDTO]);
			}
			handleCloseModal?.(DialogAction.CONFIRM);
		} catch (error) {
			console.error('Form submission error:', error);
		}
	};

	const isLoading = false;

	const courseTypeRadios = [
		{
			label: '每人固定堂數',
			value: CoursePlanType.FIXED_SESSION,
			type: [CourseType.GROUP],
			sort: 1,
		},
		{
			label: '共用堂數',
			value: CoursePlanType.SHARED_GROUP,
			type: [CourseType.GROUP],
			sort: 2,
		},
		{
			label: '單堂體驗課',
			value: CoursePlanType.SINGLE_SESSION,
			type: [CourseType.GROUP, CourseType.PRIVATE],
			sort: 4,
		},
		{
			label: '一般私人課',
			value: CoursePlanType.PRIVATE_SESSION,
			type: [CourseType.PRIVATE],
			sort: 3,
		},
	];

	// Add a check to determine if a single session plan already exists
	const singleSessionExists = planList.some(
		(plan) =>
			plan.type === CoursePlanType.SINGLE_SESSION &&
			// Only consider other plans when editing (not the current plan being edited)
			(modalType !== ModalType.EDIT || plan.id !== rowData?.id),
	);

	return (
		<Formik
			initialValues={initialValues}
			onSubmit={handleFormSubmit}
			validationSchema={validationSchema}
			validateOnChange={true}
			validateOnBlur={true}
			enableReinitialize
		>
			{({ isSubmitting, values, setFieldValue, handleSubmit, errors, touched, setTouched, validateForm }) => {
				// Custom submit handler to ensure all fields are marked as touched
				const handleFormSubmitWithValidation = async (e: React.FormEvent<HTMLFormElement>) => {
					e.preventDefault();

					// Don't submit in VIEW mode
					if (isViewMode) return;

					// Mark all fields as touched to show validation errors
					const fields = Object.keys(values);

					// Create list of all session fields based on number
					if (bkgType === CourseBkgType.FIXED && values.number) {
						const sessionCount = Number(values.number);
						if (!isNaN(sessionCount) && sessionCount > 0) {
							for (let i = 1; i <= sessionCount; i++) {
								if (!fields.includes(`courseSession${i}`)) {
									fields.push(`courseSession${i}`);
								}
							}
						}
					}

					const touchedFields = fields.reduce(
						(acc, field) => {
							acc[field] = true;
							return acc;
						},
						{} as Record<string, boolean>,
					);

					// Apply touched state to all fields
					setTouched(touchedFields);

					// Validate form
					const errors = await validateForm(values);

					// If no errors, submit the form
					if (Object.keys(errors).length === 0) {
						handleSubmit(e);
					}
				};

				return (
					<Form onSubmit={handleFormSubmitWithValidation}>
						<CoreModalContent padding='24px 0'>
							{isLoading || (isSubmitting && <CoreLoaders hasOverlay />)}
							<FormikScrollToError />
							<FormikInput
								name='name'
								title='方案名稱'
								placeholder='輸入'
								width='100%'
								isRequired
								margin='0 0 24px 0'
								hasTextCountAdornment
								textCount={values.name.length}
								maxTextCount={6}
								disabled={isViewMode}
							/>
							{bkgType === CourseBkgType.FLEXIBLE && courseType !== CourseType.INDIVIDUAL && (
								<FormikRadio
									name='type'
									title='方案類型'
									isRequired
									margin='0 0 24px 0'
									radios={courseTypeRadios
										.filter((x) => x.type.includes(courseType))
										// Filter out the single session option if one already exists (unless editing that plan)
										.filter((radio) => {
											if (radio.value === CoursePlanType.SINGLE_SESSION && singleSessionExists) {
												// If we're editing a single session plan, keep this option
												if (
													(modalType === ModalType.EDIT || modalType === ModalType.VIEW) &&
													rowData?.type === CoursePlanType.SINGLE_SESSION
												) {
													return true;
												}
												// Otherwise filter it out
												return false;
											}
											return true;
										})
										.sort((f1, f2) => f1.sort - f2.sort)}
									onChange={(event) => {
										const selectedType = event.target.value;
										setFieldValue('type', selectedType);

										// If single session is selected, set number to 1
										if (Number(selectedType) === CoursePlanType.SINGLE_SESSION) {
											setFieldValue('number', '1');
										}
									}}
									disabled={isViewMode}
								/>
							)}
							<Stack direction='row' width='100%' gap={2}>
								<FormikInput
									name='number'
									title='堂數'
									placeholder='輸入'
									wrapperSxProps={{ width: 'calc(100% /2)' }}
									isRequired
									isNumberOnly
									endAdornment={<Components.StyledAdornment type='end'>堂</Components.StyledAdornment>}
									disabled={Number(values.type) === CoursePlanType.SINGLE_SESSION || isViewMode}
								/>
								<FormikInput
									name='price'
									title={`${courseType === CourseType.GROUP ? '每人價錢/堂' : '每堂總價'}`}
									placeholder='輸入'
									wrapperSxProps={{ width: 'calc(100% /2)' }}
									isRequired
									isNumberOnly
									startAdornment={<Components.StyledAdornment type='start'>NT$</Components.StyledAdornment>}
									disabled={isViewMode}
								/>
							</Stack>
							{bkgType === CourseBkgType.FIXED && values.number.length > 0 && (
								<Box mt={3}>
									<Components.Row header tableHeader={tableHeader}>
										{tableHeader.map(({ label, width }, index) => (
											<Components.StyledCell header key={index} width={width}>
												{label}
											</Components.StyledCell>
										))}
									</Components.Row>

									{new Array(Number(values.number)).fill(Number(values.number)).map((x, i) => {
										const sessionFieldName = `courseSession${i + 1}`;
										return (
											<Components.Row key={i}>
												<Components.StyledCell dense width='80px'>
													#{i + 1}
												</Components.StyledCell>
												<Components.StyledCell dense width='250px'>
													<FormikDateTimePicker
														name={sessionFieldName}
														isRequired
														placeholder='yyyy/mm/dd hh:mm'
														width='100%'
														margin='0'
														format='YYYY/MM/DD hh:mm'
														disablePast
														disabled={isViewMode}
													/>
												</Components.StyledCell>
											</Components.Row>
										);
									})}
								</Box>
							)}
							<FormikRadio
								name='promotionType'
								title='課程優惠'
								isRequired
								margin='24px 0 0 0'
								onChange={(event) => {
									const selectedType = event.target.value;
									setFieldValue('promotionType', selectedType);
									if (selectedType === '0') {
										setFieldValue('promotion', '');
									}
								}}
								radios={[
									{
										label: '無',
										value: '0',
									},
									{
										label: '有課程優惠',
										value: '1',
									},
								]}
								disabled={isViewMode}
							/>
							{values.promotionType === '1' && (
								<FormikInput
									name='promotion'
									title='優惠說明'
									placeholder='輸入'
									width='100%'
									isRequired
									hasTextCountAdornment
									textCount={values.promotion ? values.promotion.length : 0}
									maxTextCount={8}
									wrapperSxProps={{
										marginTop: 1.5,
										padding: '16px 24px',
										borderRadius: 2,
										backgroundColor: 'background.light',
									}}
									disabled={isViewMode}
								/>
							)}
						</CoreModalContent>
						<StyledAbsoluteModalActions justifyContent='space-between'>
							{modalType === ModalType.EDIT && !isViewMode && (
								<CoreButton
									color='error'
									variant='text'
									label='刪除'
									iconType='delete'
									onClick={() => {
										console.log('Delete button clicked');
										console.log('rowData:', rowData);
										console.log('planList:', planList);

										if (rowData?.sequence && planList) {
											console.log('Attempting to delete plan with sequence:', rowData.sequence);
											const filteredList = planList.filter((plan) => {
												console.log(
													'Comparing plan.sequence:',
													plan.sequence,
													'with rowData.sequence:',
													rowData.sequence,
												);
												return plan.sequence !== rowData.sequence;
											});
											console.log('Filtered list:', filteredList);
											updatePlanList(filteredList.length > 0 ? filteredList : []);
										} else {
											console.log('Cannot delete: rowData.sequence or planList is missing');
										}
										handleCloseModal?.(DialogAction.CANCEL);
									}}
									margin='0 12px 0 0'
								/>
							)}
							<Stack direction='row'>
								<CoreButton
									color='default'
									variant='outlined'
									label='取消'
									onClick={() => handleCloseModal?.(DialogAction.CANCEL)}
									margin='0 12px 0 0'
								/>
								{!isViewMode ? (
									<CoreButton color='primary' variant='contained' type='submit' label='確認' />
								) : (
									<CoreButton
										color='primary'
										variant='contained'
										onClick={() => handleCloseModal?.(DialogAction.CANCEL)}
										label='關閉'
									/>
								)}
							</Stack>
						</StyledAbsoluteModalActions>
					</Form>
				);
			}}
		</Formik>
	);
};

export default AddEditPlanModal;
