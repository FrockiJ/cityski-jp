import { BkgAfterCourseType, CourseBkgType, CoursePaxLimitType, CourseType } from '@repo/shared';
import * as Yup from 'yup';

import { yupImageCheck } from '@/Formik/FormikFileUploadImage';

export const getDraftValidationSchema = () =>
	Yup.object().shape({
		name: Yup.string().required('必填欄位'),
	});

export const getFullValidationSchema = (courseType: CourseType) =>
	Yup.object().shape({
		name: Yup.string().required('必填欄位'),
		description: Yup.string().required('必填欄位'),
		explanation: Yup.string().required('必填欄位'),
		courseFee: Yup.string().required('必填欄位'),
		promotion: Yup.string(),
		coverImg: yupImageCheck(true),
		otherImg1: yupImageCheck(true),
		otherImg2: yupImageCheck(true),
		otherImg3: yupImageCheck(true),
		otherImg4: yupImageCheck(true),
		otherImg5: yupImageCheck(true),
		skiType: Yup.string().required('必填欄位'),
		bkgType: Yup.string().required('必填欄位'),
		length: Yup.string().required('必填欄位'),
		coursePlans: Yup.array().min(1, '請新增至少一個方案').required('請新增至少一個方案'),
		bkgStartDay: Yup.string().when('bkgType', {
			is: (val: string) => Number(val) === CourseBkgType.FLEXIBLE,
			then: (schema) => schema.required('必填欄位'),
			otherwise: (schema) => schema,
		}),
		bkgAfterCourse: Yup.string().required('必填欄位'),
		bkgLatestDay: Yup.string().when('bkgAfterCourse', {
			is: (val: string) => Number(val) === BkgAfterCourseType.CUSTOM,
			then: (schema) => schema.required('必填欄位'),
			otherwise: (schema) => schema,
		}),
		bkgLatestDayUnit: Yup.string(),
		checkBefDayRow: Yup.string(),
		checkBefDay: Yup.string().when('bkgType', {
			is: (val: string) => Number(val) === CourseBkgType.FIXED,
			then: (schema) => schema.required('必填欄位'),
			otherwise: (schema) => schema,
		}),
		// coursePeople: Yup.array().min(1, '必填欄位').required('必填欄位'),
		minPeopleEveryday: Yup.string().when('coursePaxLimit', {
			is: CoursePaxLimitType.SAME,
			then: (schema) => schema.required('必填欄位'),
			otherwise: (schema) => schema,
		}),
		maxPeopleEveryday: Yup.string()
			.when('coursePaxLimit', {
				is: CoursePaxLimitType.SAME,
				then: (schema) => schema.required('必填欄位'),
				otherwise: (schema) => schema,
			})
			.test('is-greater-than-min', '最大人數必須大於最小人數', function (value) {
				const { minPeopleEveryday, coursePaxLimit } = this.parent;
				if (coursePaxLimit !== CoursePaxLimitType.SAME || !value) return true;
				return Number(value) >= Number(minPeopleEveryday);
			}),
		minPeopleWeekday: Yup.string().when('coursePaxLimit', {
			is: CoursePaxLimitType.DIFFERENT,
			then: (schema) => schema.required('必填欄位'),
			otherwise: (schema) => schema,
		}),
		maxPeopleWeekday: Yup.string()
			.when('coursePaxLimit', {
				is: CoursePaxLimitType.DIFFERENT,
				then: (schema) => schema.required('必填欄位'),
				otherwise: (schema) => schema,
			})
			.test('is-greater-than-min-weekday', '最大人數必須大於最小人數', function (value) {
				const { minPeopleWeekday, coursePaxLimit } = this.parent;
				if (coursePaxLimit !== CoursePaxLimitType.DIFFERENT || !value) return true;
				return Number(value) >= Number(minPeopleWeekday);
			}),
		minPeopleWeekend: Yup.string().when('coursePaxLimit', {
			is: CoursePaxLimitType.DIFFERENT,
			then: (schema) => schema.required('必填欄位'),
			otherwise: (schema) => schema,
		}),
		maxPeopleWeekend: Yup.string()
			.when('coursePaxLimit', {
				is: CoursePaxLimitType.DIFFERENT,
				then: (schema) => schema.required('必填欄位'),
				otherwise: (schema) => schema,
			})
			.test('is-greater-than-min-weekend', '最大人數必須大於最小人數', function (value) {
				const { minPeopleWeekend, coursePaxLimit } = this.parent;
				if (coursePaxLimit !== CoursePaxLimitType.DIFFERENT || !value) return true;
				return Number(value) >= Number(minPeopleWeekend);
			}),
		...(courseType === CourseType.PRIVATE
			? {
					basePeople: Yup.string()
						.required('必填欄位')
						.test('is-between-min-max', '基本人數必須介於最小人數和最大人數之間', function (value) {
							const { minPeopleEveryday, maxPeopleEveryday } = this.parent;
							return Number(value) >= Number(minPeopleEveryday) && Number(value) <= Number(maxPeopleEveryday);
						}),
					addPrice: Yup.string().required('必填欄位'),
				}
			: {}),
		coursePaxLimit: Yup.string().required('必填欄位'),
		releaseType: Yup.string().required('必填欄位'),
		releaseDate: Yup.date()
			.nullable()
			.when('releaseType', {
				is: (value: string) => value !== 'I',
				then: (schema) => schema.required('必填'),
				otherwise: (schema) => schema.nullable(),
			}),
		// .test('is-future-date', '上架日期必須大於今天', function (value) {
		// 	const { releaseType } = this.parent;
		// 	if (releaseType === 'N' || !value) return true; // Skip validation if type is 'N'
		// 	const today = new Date();
		// 	today.setHours(0, 0, 0, 0);
		// 	const releaseDate = new Date(value);
		// 	releaseDate.setHours(0, 0, 0, 0);
		// 	return releaseDate > today;
		// }),
		removalType: Yup.string().required('必填欄位'),
		removalDate: Yup.date()
			.nullable()
			.when('removalType', {
				is: (value: string) => value !== 'U',
				then: (schema) => schema.required('必填'),
				otherwise: (schema) => schema.nullable(),
			})
			.test('is-after-release-date', '下架日期必須大於或等於上架日期', function (value) {
				const { removalType, releaseType, releaseDate } = this.parent;
				if (removalType === 'N' || !value || releaseType === 'N' || !releaseDate) return true; // Skip validation if any type is 'N'
				const removalDateObj = new Date(value);
				removalDateObj.setHours(0, 0, 0, 0);
				const releaseDateObj = new Date(releaseDate);
				releaseDateObj.setHours(0, 0, 0, 0);
				return removalDateObj >= releaseDateObj;
			}),
	});
