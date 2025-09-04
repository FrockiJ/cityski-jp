import React, { useCallback } from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { alpha, MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material';
import {
	BkgAfterCourseType,
	BkgAfterCourseTypeUnit,
	CourseBkgType,
	CoursePaxLimitType,
	CourseStatusType,
	CourseType,
	CreateCoursePlanRequestDto,
} from '@repo/shared';
import { useFormikContext } from 'formik';

import CoreBlockRow from '@/components/Common/CIBase/CoreModal/CoreAnchorModal/CoreBlockRow';
import FormikInput from '@/components/Common/CIBase/Formik/FormikInput';
import FormikModalTable from '@/components/Common/CIBase/Formik/FormikModalTable';
import FormikRadio from '@/components/Common/CIBase/Formik/FormikRadio';
import FormikRow from '@/components/Common/CIBase/Formik/FormikRow';
import CoursePlanTable from '@/components/Project/CourseProducts/AddEditViewCourseIndoorModal/PlanDetails/CoursePlanTable';
import * as Components from '@/components/Project/shared/Components';

import { CoursePeopleItem } from '../types';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

interface PlanDetailsProps {
	courseType: CourseType;
	planList: CreateCoursePlanRequestDto[];
	updatePlanList: (planList: CreateCoursePlanRequestDto[]) => void;
	coursePeople: CoursePeopleItem[];
	updateCoursePeople: (coursePeople: CoursePeopleItem[]) => void;
	hasSubmitted?: boolean;
	isSavingDraft?: boolean;
	courseStatusType?: CourseStatusType;
}

interface FormValues {
	bkgType: string;
	bkgAfterCourse: string;
	bkgLatestDay: string;
	bkgLatestDayUnit: string;
	length: string;
	coursePaxLimit: string;
	// 每日 (type 0)
	minPeopleEveryday: string;
	maxPeopleEveryday: string;
	basePeople: string;
	addPrice: string;
	// 平日 (type 1)
	minPeopleWeekday: string;
	maxPeopleWeekday: string;
	// 週末 (type 2)
	minPeopleWeekend: string;
	maxPeopleWeekend: string;
}

const courseBkgTypeRadios = [
	{
		label: '預約式課程',
		description: '彈性預約上課時間',
		value: CourseBkgType.FLEXIBLE,
		type: [CourseType.GROUP, CourseType.INDIVIDUAL, CourseType.PRIVATE],
	},
	{
		label: '指定時間課程',
		description: '訂購時學員選擇由CitySki指定的時段',
		value: CourseBkgType.FIXED,
		type: [CourseType.GROUP, CourseType.INDIVIDUAL],
	},
];

const PlanDetails: React.FC<PlanDetailsProps> = ({
	courseType,
	planList,
	updatePlanList,
	coursePeople,
	updateCoursePeople,
	hasSubmitted,
	isSavingDraft,
	courseStatusType,
}) => {
	const isPublished = courseStatusType === CourseStatusType.PUBLISHED;
	const isUnpublished = courseStatusType === CourseStatusType.UNPUBLISHED;
	const isDisabled = isPublished || isUnpublished;
	const { values, setFieldValue } = useFormikContext<FormValues>();
	// console.log('courseType', courseType);

	// Handle input changes - wrap in useCallback
	const handleInputChange = useCallback(
		(type: number, field: keyof CoursePeopleItem, value: number) => {
			const updatedPeople = [...coursePeople];

			type FormFieldMapType = {
				0: {
					minPeople: 'minPeopleEveryday';
					maxPeople: 'maxPeopleEveryday';
					basePeople: 'basePeople';
					addPrice: 'addPrice';
				};
				1: {
					minPeople: 'minPeopleWeekday';
					maxPeople: 'maxPeopleWeekday';
				};
				2: {
					minPeople: 'minPeopleWeekend';
					maxPeople: 'maxPeopleWeekend';
				};
			};

			const formFieldMap: FormFieldMapType = {
				0: {
					minPeople: 'minPeopleEveryday',
					maxPeople: 'maxPeopleEveryday',
					basePeople: 'basePeople',
					addPrice: 'addPrice',
				},
				1: {
					minPeople: 'minPeopleWeekday',
					maxPeople: 'maxPeopleWeekday',
				},
				2: {
					minPeople: 'minPeopleWeekend',
					maxPeople: 'maxPeopleWeekend',
				},
			};

			// Find existing item or create new one
			const existingIndex = updatedPeople.findIndex((p) => p.type === type);
			if (existingIndex === -1) {
				updatedPeople.push({
					type,
					minPeople: 0,
					maxPeople: 0,
					...(type === 0 && courseType === CourseType.PRIVATE ? { basePeople: 0, addPrice: 0 } : {}),
				});
			}

			// Update coursePeople state
			const itemIndex = existingIndex === -1 ? updatedPeople.length - 1 : existingIndex;
			updatedPeople[itemIndex] = {
				...updatedPeople[itemIndex],
				[field]: value,
			};

			// Update form values
			const typeKey = type as keyof FormFieldMapType;
			const formField = formFieldMap[typeKey]?.[field as keyof (typeof formFieldMap)[typeof typeKey]];
			if (formField) {
				setFieldValue(formField, String(value));
			}

			updateCoursePeople(updatedPeople);
		},
		[coursePeople, updateCoursePeople, courseType, setFieldValue],
	);

	// Ensure coursePeople array is properly initialized based on coursePaxLimit
	React.useEffect(() => {
		// Initialize or update coursePeople based on coursePaxLimit
		if (values.coursePaxLimit === CoursePaxLimitType.DIFFERENT) {
			// For different limits, we need type 1 (weekday) and type 2 (weekend)
			const updatedPeople = [...coursePeople];

			// Ensure we have a weekday entry (type 1)
			const weekdayIndex = updatedPeople.findIndex((p) => p.type === 1);
			if (weekdayIndex === -1) {
				// Create a new weekday entry
				updatedPeople.push({
					type: 1,
					minPeople: updatedPeople[0]?.minPeople || 0,
					maxPeople: updatedPeople[0]?.maxPeople || 0,
					...(courseType === CourseType.PRIVATE
						? {
								basePeople: updatedPeople[0]?.basePeople || 0,
								addPrice: updatedPeople[0]?.addPrice || 0,
							}
						: {}),
				});
			}

			// Ensure we have a weekend entry (type 2)
			const weekendIndex = updatedPeople.findIndex((p) => p.type === 2);
			if (weekendIndex === -1) {
				// Create a new weekend entry
				updatedPeople.push({
					type: 2,
					minPeople: updatedPeople[0]?.minPeople || 0,
					maxPeople: updatedPeople[0]?.maxPeople || 0,
					...(courseType === CourseType.PRIVATE
						? {
								basePeople: updatedPeople[0]?.basePeople || 0,
								addPrice: updatedPeople[0]?.addPrice || 0,
							}
						: {}),
				});
			}

			if (weekdayIndex === -1 || weekendIndex === -1) {
				updateCoursePeople(updatedPeople);
			}
		} else {
			// For same limits, we need type 0 (every day)
			const updatedPeople = [...coursePeople];

			// Ensure we have an every day entry (type 0)
			const everydayIndex = updatedPeople.findIndex((p) => p.type === 0);
			if (everydayIndex === -1 && updatedPeople.length === 0) {
				// Create a new every day entry
				updatedPeople.push({
					type: 0,
					minPeople: 0,
					maxPeople: 0,
					...(courseType === CourseType.PRIVATE ? { basePeople: 0, addPrice: 0 } : {}),
				});
				updateCoursePeople(updatedPeople);
			} else if (everydayIndex === -1 && updatedPeople.length > 0) {
				// Convert existing entries to type 0
				const newEverydayEntry = {
					type: 0,
					minPeople: updatedPeople[0]?.minPeople || 0,
					maxPeople: updatedPeople[0]?.maxPeople || 0,
					...(courseType === CourseType.PRIVATE
						? {
								basePeople: updatedPeople[0]?.basePeople || 0,
								addPrice: updatedPeople[0]?.addPrice || 0,
							}
						: {}),
				};
				updateCoursePeople([newEverydayEntry]);
			}
		}
	}, [values.coursePaxLimit, coursePeople, updateCoursePeople, courseType]);

	// Memoize the table rows to prevent re-rendering issues
	const tableRowCells = React.useMemo(() => {
		if (values.coursePaxLimit === CoursePaxLimitType.DIFFERENT) {
			return [
				// First row for weekdays (平日)
				[
					{
						width: '100px',
						label: '平日',
						show: true,
					},
					{
						width: '150px',
						show: true,
						component: (
							<FormikInput
								key='minPeople_weekday'
								name='minPeopleWeekday'
								placeholder='輸入'
								width='125px'
								hasClearIcon={false}
								margin='0 10px'
								isRequired
								isNumberOnly
								value={values.minPeopleWeekday}
								onChange={(e) => handleInputChange(1, 'minPeople', Number(e.target.value))}
								disabled={isDisabled}
							/>
						),
					},
					{
						width: '150px',
						show: true,
						component: (
							<FormikInput
								key='maxPeople_weekday'
								name='maxPeopleWeekday'
								placeholder='輸入'
								width='125px'
								hasClearIcon={false}
								margin='0 10px'
								isRequired
								isNumberOnly
								value={values.maxPeopleWeekday}
								onChange={(e) => handleInputChange(1, 'maxPeople', Number(e.target.value))}
								disabled={isDisabled}
							/>
						),
					},
					{
						width: '350px',
						show:
							(courseType === CourseType.INDIVIDUAL && Number(values.bkgType) === CourseBkgType.FIXED) ||
							(courseType === CourseType.INDIVIDUAL && Number(values.bkgType) === CourseBkgType.FLEXIBLE) ||
							(courseType === CourseType.GROUP && Number(values.bkgType) === CourseBkgType.FIXED) ||
							(courseType === CourseType.GROUP && Number(values.bkgType) === CourseBkgType.FLEXIBLE),
					},
				],
				// Second row for weekends (週末)
				[
					{
						width: '100px',
						label: '週末',
						show: true,
					},
					{
						width: '150px',
						show: true,
						component: (
							<FormikInput
								key='minPeople_weekend'
								name='minPeopleWeekend'
								placeholder='輸入'
								width='125px'
								hasClearIcon={false}
								margin='0 10px'
								isRequired
								isNumberOnly
								value={values.minPeopleWeekend}
								onChange={(e) => handleInputChange(2, 'minPeople', Number(e.target.value))}
								disabled={isDisabled}
							/>
						),
					},
					{
						width: '150px',
						show: true,
						component: (
							<FormikInput
								key='maxPeople_weekend'
								name='maxPeopleWeekend'
								placeholder='輸入'
								width='125px'
								hasClearIcon={false}
								margin='0 10px'
								isRequired
								isNumberOnly
								value={values.maxPeopleWeekend}
								onChange={(e) => handleInputChange(2, 'maxPeople', Number(e.target.value))}
								disabled={isDisabled}
							/>
						),
					},
					{
						width: '350px',
						show:
							(courseType === CourseType.INDIVIDUAL && Number(values.bkgType) === CourseBkgType.FIXED) ||
							(courseType === CourseType.INDIVIDUAL && Number(values.bkgType) === CourseBkgType.FLEXIBLE) ||
							(courseType === CourseType.GROUP && Number(values.bkgType) === CourseBkgType.FIXED) ||
							(courseType === CourseType.GROUP && Number(values.bkgType) === CourseBkgType.FLEXIBLE),
					},
				],
			];
		} else {
			return [
				// Original single row for "every day" when coursePaxLimit is SAME
				[
					{
						width: '100px',
						label: '每天',
						show: true,
					},
					{
						width: '150px',
						show: true,
						component: (
							<FormikInput
								key='minPeople'
								name='minPeopleEveryday'
								placeholder='輸入'
								width='125px'
								hasClearIcon={false}
								margin='0 10px'
								isRequired
								isNumberOnly
								value={values.minPeopleEveryday}
								onChange={(e) => handleInputChange(0, 'minPeople', Number(e.target.value))}
								disabled={isDisabled}
							/>
						),
					},
					{
						width: '150px',
						show: true,
						component: (
							<FormikInput
								key='maxPeople'
								name='maxPeopleEveryday'
								placeholder='輸入'
								width='125px'
								hasClearIcon={false}
								margin='0 10px'
								isRequired
								isNumberOnly
								value={values.maxPeopleEveryday}
								onChange={(e) => handleInputChange(0, 'maxPeople', Number(e.target.value))}
								disabled={isDisabled}
							/>
						),
					},
					{
						width: '350px',
						show:
							(courseType === CourseType.INDIVIDUAL && Number(values.bkgType) === CourseBkgType.FIXED) ||
							(courseType === CourseType.INDIVIDUAL && Number(values.bkgType) === CourseBkgType.FLEXIBLE) ||
							(courseType === CourseType.GROUP && Number(values.bkgType) === CourseBkgType.FIXED) ||
							(courseType === CourseType.GROUP && Number(values.bkgType) === CourseBkgType.FLEXIBLE),
					},
					{
						width: '200px',
						show: courseType === CourseType.PRIVATE && Number(values.bkgType) === CourseBkgType.FLEXIBLE,
						component: (
							<FormikInput
								key='basePeople'
								name='basePeople'
								placeholder='輸入'
								width='175px'
								hasClearIcon={false}
								margin='0 10px'
								isRequired
								isNumberOnly
								value={values.basePeople}
								onChange={(e) => handleInputChange(0, 'basePeople', Number(e.target.value))}
								disabled={isDisabled}
							/>
						),
					},
					{
						width: '150px',
						show: courseType === CourseType.PRIVATE && Number(values.bkgType) === CourseBkgType.FLEXIBLE,
						component: (
							<FormikInput
								key='addPrice'
								name='addPrice'
								placeholder='輸入'
								width='125px'
								hasClearIcon={false}
								margin='0 10px'
								isRequired
								isNumberOnly
								value={values.addPrice}
								onChange={(e) => handleInputChange(0, 'addPrice', Number(e.target.value))}
								disabled={isDisabled}
							/>
						),
					},
				],
			];
		}
	}, [
		values.coursePaxLimit,
		values.bkgType,
		courseType,
		values.minPeopleEveryday,
		values.maxPeopleEveryday,
		values.minPeopleWeekday,
		values.maxPeopleWeekday,
		values.minPeopleWeekend,
		values.maxPeopleWeekend,
		values.basePeople,
		values.addPrice,
		handleInputChange,
		isDisabled,
	]);

	return (
		<>
			<CoreBlockRow>
				<FormikRadio
					name='bkgType'
					title='課程預約形式'
					isRequired
					isCustomLabel
					margin='0'
					width='100%'
					radios={courseBkgTypeRadios.filter((x) => x.type.includes(courseType))}
					labelSxProps={{
						width: '363px',
					}}
					disabled={isDisabled}
				/>
			</CoreBlockRow>
			<CoreBlockRow>
				<FormikInput
					name='length'
					title='授課時長'
					placeholder='輸入'
					width='200px'
					isRequired
					isNumberWithOneDecimal
					endAdornment={<Components.StyledAdornment type='end'>小時</Components.StyledAdornment>}
					disabled
				/>
			</CoreBlockRow>
			<CoreBlockRow>
				<CoursePlanTable
					name='planAndPrice'
					title='方案與價錢'
					isRequired
					width='100%'
					margin='24px 0 0 0'
					courseType={courseType}
					bkgType={Number(values.bkgType)}
					// keep track of planList and updatePlanList
					planList={planList}
					updatePlanList={updatePlanList}
					hasSubmitted={hasSubmitted}
					isSavingDraft={isSavingDraft}
					disabled={isDisabled}
					courseStatusType={courseStatusType}
				/>
			</CoreBlockRow>
			{Number(values.bkgType) === CourseBkgType.FLEXIBLE && (
				<>
					<CoreBlockRow>
						<FormikInput
							name='bkgStartDay'
							title='最快可以預約的課程時間'
							placeholder='輸入'
							width='200px'
							isRequired
							endAdornment={<Components.StyledAdornment type='end'>小時候</Components.StyledAdornment>}
							disabled={isDisabled}
						/>
					</CoreBlockRow>
					<CoreBlockRow>
						<FormikRadio
							name='bkgAfterCourse'
							value={values.bkgAfterCourse}
							title='可預約到多久之後的課程'
							isRequired
							margin='0'
							width='100%'
							radios={[
								{ label: '無限制', value: BkgAfterCourseType.UNLIMITED },
								{ label: '自訂', value: BkgAfterCourseType.CUSTOM },
							]}
							disabled={isDisabled}
						/>
					</CoreBlockRow>
				</>
			)}
			{Number(values.bkgType) === CourseBkgType.FIXED && (
				<CoreBlockRow>
					<FormikRow name='checkBefDayRow' title='確認開課的期限' isRequired width='100%' margin='0 0 24px 0'>
						開課前
						<FormikInput
							name='checkBefDay'
							placeholder=''
							width='100px'
							margin='0 10px'
							isRequired
							endAdornment={<Components.StyledAdornment type='end'>天</Components.StyledAdornment>}
							disabled={isDisabled}
						/>
						確認報名人數是否達到最低開課人數，若未達到該方案就停止報名，自動退款
					</FormikRow>
				</CoreBlockRow>
			)}
			{Number(values.bkgType) === CourseBkgType.FLEXIBLE &&
				Number(values.bkgAfterCourse) === BkgAfterCourseType.CUSTOM && (
					<CoreBlockRow
						sx={{
							display: 'flex',
							alignItems: 'center',
							flexWrap: 'wrap',
							padding: '16px 24px',
							borderRadius: 2,
							backgroundColor: 'background.light',
						}}
					>
						從預約時當天起算，
						<FormikInput
							name='bkgLatestDay'
							placeholder='輸入'
							width='200px'
							hasClearIcon={false}
							margin='0 10px'
							isRequired
							isNumberOnly
							disabled={isDisabled}
							endAdornment={
								<Components.StyledAdornment type='end'>
									<Select
										autoWidth
										value={values.bkgLatestDayUnit}
										onChange={(event: SelectChangeEvent) => {
											setFieldValue('bkgLatestDayUnit', event.target.value);
										}}
										size='small'
										IconComponent={KeyboardArrowDownIcon}
										disabled={isDisabled}
										slotProps={{
											root: {
												sx: {
													height: 24,
													color: 'text.quaternary',
													'.MuiSelect-select.MuiOutlinedInput-input': {
														padding: '0 24px 0 0',
													},
													'.MuiSvgIcon-root.MuiSelect-icon': {
														right: 0,
													},
													'fieldset.MuiOutlinedInput-notchedOutline': {
														border: 'none',
													},
												},
											},
										}}
										MenuProps={{
											MenuListProps: {
												sx: {
													display: 'flex',
													flexDirection: 'column',
													padding: 1,
													gap: 0.5,
												},
											},
											PaperProps: {
												style: {
													maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
													width: 80,
													marginTop: 12,
													borderRadius: 12,
												},
											},
										}}
									>
										<MenuItem
											value={BkgAfterCourseTypeUnit.HOUR}
											dense
											sx={{
												'&.MuiMenuItem-root:hover': {
													backgroundColor: alpha('#919EAB', 0.16),
													borderRadius: 1.5,
												},
												'&.MuiMenuItem-root.Mui-selected': {
													backgroundColor: alpha('#919EAB', 0.16),
													borderRadius: 1.5,
												},
											}}
										>
											小時
										</MenuItem>
										<MenuItem
											value={BkgAfterCourseTypeUnit.DAY}
											dense
											sx={{
												'&.MuiMenuItem-root:hover': {
													backgroundColor: alpha('#919EAB', 0.16),
													borderRadius: 1.5,
												},
												'&.MuiMenuItem-root.Mui-selected': {
													backgroundColor: alpha('#919EAB', 0.16),
													borderRadius: 1.5,
												},
											}}
										>
											天
										</MenuItem>
									</Select>
								</Components.StyledAdornment>
							}
						/>
						內的時段可以預約
					</CoreBlockRow>
				)}
			{courseType === CourseType.GROUP ? (
				<FormikRadio
					name='coursePaxLimit'
					title='人數限制條件'
					isRequired
					margin='0'
					width='100%'
					radios={[
						{ label: '平日與週末相同', value: CoursePaxLimitType.SAME },
						{ label: '區分平日與週末', value: CoursePaxLimitType.DIFFERENT },
					]}
					disabled={isDisabled}
				/>
			) : (
				<Typography variant='body2' color='text.secondary'>
					<span style={{ color: '#FF5630' }}>*</span>人數限制條件
				</Typography>
			)}
			<FormikModalTable
				name='coursePaxLimitTable'
				margin='24px 0 0 0'
				tableHeader={[
					{
						label: '每堂',
						width: '100px',
						show: true,
					},
					{
						label: '最少人數',
						width: '150px',
						show: true,
					},
					{
						label: '最多人數',
						width: '150px',
						show: true,
					},
					{
						label: ' ',
						width: '350px',
						show:
							(courseType === CourseType.INDIVIDUAL && Number(values.bkgType) === CourseBkgType.FIXED) ||
							(courseType === CourseType.INDIVIDUAL && Number(values.bkgType) === CourseBkgType.FLEXIBLE) ||
							(courseType === CourseType.GROUP && Number(values.bkgType) === CourseBkgType.FIXED) ||
							(courseType === CourseType.GROUP && Number(values.bkgType) === CourseBkgType.FLEXIBLE),
					},
					{
						label: '費用包含的基本人數',
						width: '200px',
						show: courseType === CourseType.PRIVATE && Number(values.bkgType) === CourseBkgType.FLEXIBLE,
					},
					{
						label: '加價 (NT$) / 人',
						width: '150px',
						show: courseType === CourseType.PRIVATE && Number(values.bkgType) === CourseBkgType.FLEXIBLE,
					},
				]}
				tableRowCell={tableRowCells}
			/>
		</>
	);
};

export default PlanDetails;
