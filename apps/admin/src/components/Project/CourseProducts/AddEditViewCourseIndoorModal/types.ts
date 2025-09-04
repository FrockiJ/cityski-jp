import {
	CourseInfoType,
	CourseReleaseType,
	CourseRemovalType,
	CourseStatusType,
	CourseType,
	CreateCoursePlanRequestDto,
} from '@repo/shared';

import { CancelPolicy } from './CancelReservation';

export interface InitialValuesProps {
	// 基本設定
	name: string;
	courseType: CourseType;
	courseStatusType: CourseStatusType;
	skiType: string;
	// 課程簡介
	description: string;
	explanation: string;
	coverImg?: string;
	otherImg1?: string;
	otherImg2?: string;
	otherImg3?: string;
	otherImg4?: string;
	otherImg5?: string;
	promotion: string;
	// 方案詳情
	bkgType: string;
	length: string;
	bkgStartDay: string;
	bkgAfterCourse: string;
	bkgLatestDay?: string;
	bkgLatestDayUnit: string;
	// 方案
	coursePlans: CreateCoursePlanRequestDto[];
	// 人數限制條件
	coursePeople: CoursePeopleItem[];
	// 課程上下架管理
	releaseType: CourseReleaseType;
	releaseDate: string | null;
	removalType: CourseRemovalType;
	removalDate: string | null;
	// 課程資訊
	courseTarget: CourseDescItem[];
	practiceContent: CourseDescItem[];
	courseFee: string;
	// 以下尚未分類
	checkBefDayRow?: string;
	checkBefDay?: string;
	// 每日 (type 0)
	minPeopleEveryday: string;
	maxPeopleEveryday: string;
	basePeople: string; // only for 每日
	addPrice: string; // only for 每日
	// 平日 (type 1)
	minPeopleWeekday: string;
	maxPeopleWeekday: string;
	// 週末 (type 2)
	minPeopleWeekend: string;
	maxPeopleWeekend: string;
	coursePaxLimit: string;
	courseRelease: CourseReleaseType;
	courseRemoval: CourseRemovalType;
	// 預約取消辦法
	hasCancelPolicy: string;
	policies: CancelPolicy[];
	daysBeforeFree: string;
}

export interface CoursePeopleItem {
	id?: string;
	type: number; // 0: 每天, 1: 平日, 2: 周末
	minPeople: number;
	maxPeople: number;
	basePeople?: number;
	addPrice?: number;
}

export interface CourseDescItem {
	id?: string | null;
	type?: CourseInfoType | null;
	explanation?: string | null;
	sequence?: number | null;
}

export interface CourseCancelPolicy {
	id?: string;
	type: number;
	beforeDay?: number;
	withinDay?: number;
	price?: number;
	sequence: number;
}
