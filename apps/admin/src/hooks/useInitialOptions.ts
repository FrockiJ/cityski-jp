import { useEffect } from 'react';
import { MultiValue } from 'react-select';
import { createAsyncThunk } from '@reduxjs/toolkit';
import {
	CourseBkgType,
	CourseStatusType,
	CourseType,
	CourseSkiType,
	DiscountStatus,
	MemberStatus,
	MemberType,
	Option,
	OptionManagerType,
	OptionNames,
	ReservationStatus,
} from '@repo/shared';

import { selectOptions } from '@/state/slices/optionSlice';
import { useAppDispatch, useAppSelector } from '@/state/store';

async function checkOptionsAndAdd(
	optionManager: OptionManagerType,
	key: OptionNames,
	getOption: () => MultiValue<Option> | Promise<MultiValue<Option>>,
) {
	try {
		const option: MultiValue<Option> = await Promise.resolve(getOption());
		if (option) {
			optionManager[key] = option;
		}
	} catch (error) {
		console.error(error);
	}
}

const fetchOptionManager = async () => {
	const optionManager: OptionManagerType = {};

	await Promise.all([
		// for Demo
		checkOptionsAndAdd(optionManager, OptionNames.USER_STATUS, () => [
			{ label: 'All', value: 'all' },
			{ label: 'Active', value: 'active' },
			{ label: 'InActive', value: 'inActive' },
		]),

		// permissions-personnel > user > filter Select Options
		checkOptionsAndAdd(optionManager, OptionNames.USER_ROLE, () => []),

		// promotion-settings > filter Select Options
		checkOptionsAndAdd(optionManager, OptionNames.DISCOUNT_STATUS, () => [
			{ label: '啟用中', value: DiscountStatus.ACTIVE },
			{ label: '已停用', value: DiscountStatus.INACTIVE },
			{ label: '已過期', value: DiscountStatus.EXPIRED },
		]),

		// member-management > filter Select Options
		checkOptionsAndAdd(optionManager, OptionNames.MEMBER_SNOWBOARD, () => [
			...new Array(20).fill({ label: '', value: 0 }).map((x, i) => ({ label: String(i + 1), value: i + 1 })),
		]),

		// member-management > filter Select Options
		checkOptionsAndAdd(optionManager, OptionNames.MEMBER_SKIS, () => [
			...new Array(20).fill({ label: '', value: 0 }).map((x, i) => ({ label: String(i + 1), value: i + 1 })),
		]),

		// member-management > filter Select Options
		checkOptionsAndAdd(optionManager, OptionNames.MEMBER_TYPE, () => [
			{ label: 'LINE', value: MemberType.L },
			{ label: 'Email', value: MemberType.E },
		]),

		// member-management > filter Select Options
		checkOptionsAndAdd(optionManager, OptionNames.MEMBER_STATUS, () => [
			{ label: '停用', value: MemberStatus.INACTIVE },
			{ label: '啟用', value: MemberStatus.ACTIVE },
			{ label: '未開通', value: MemberStatus.NOT_YET_VERIFIED },
		]),

		// course-products > filter Select Options
		checkOptionsAndAdd(optionManager, OptionNames.COURSE_STATUS, () => [
			{ label: '草稿', value: CourseStatusType.DRAFT },
			{ label: '排程中', value: CourseStatusType.SCHEDULED },
			{ label: '已上架', value: CourseStatusType.PUBLISHED },
			{ label: '已下架', value: CourseStatusType.UNPUBLISHED },
		]),

		// course-products > filter Select Options
		checkOptionsAndAdd(optionManager, OptionNames.COURSE_TYPE, () => [
			{ label: '團體課', value: CourseType.GROUP },
			{ label: '私人課', value: CourseType.PRIVATE },
			{ label: '個人練習', value: CourseType.INDIVIDUAL },
		]),

		// course-products > filter Select Options
		checkOptionsAndAdd(optionManager, OptionNames.COURSE_BOOKING_TYPE, () => [
			{ label: '預約式課程', value: CourseBkgType.FLEXIBLE },
			{ label: '指定式課程', value: CourseBkgType.FIXED },
		]),

		// reservation-management > filter Select Options
		checkOptionsAndAdd(optionManager, OptionNames.RESERVATION_STATUS, () => [
			{ label: '已排定', value: ReservationStatus.SCHEDULED },
			{ label: '待紀錄', value: ReservationStatus.PENDING_REVIEW },
			{ label: '已完成', value: ReservationStatus.COMPLETED },
			{ label: '已取消', value: ReservationStatus.CANCELED },
		]),

		// reservation-management > filter Select Options
		checkOptionsAndAdd(optionManager, OptionNames.COURSE_SKI_TYPE, () => [
			{ label: '單板和雙板', value: CourseSkiType.BOTH },
			{ label: '單板', value: CourseSkiType.SNOWBOARD },
			{ label: '雙板', value: CourseSkiType.SKI },
		]),

		// reservation-management > filter Select Options
		checkOptionsAndAdd(optionManager, OptionNames.SKI_SNOWBOARD_LEVEL, () => [
			{ label: '1', value: '1' },
			{ label: '2', value: '2' },
			{ label: '3', value: '3' },
			{ label: '4', value: '4' },
			{ label: '5', value: '5' },
			{ label: '6', value: '6' },
			{ label: '7', value: '7' },
			{ label: '7以上', value: '7+' },
		]),

		// reservation-management > filter Select Options (教練)
		// 延遲載入：在打開篩選抽屜時動態載入，這裡先設為空陣列
		checkOptionsAndAdd(optionManager, OptionNames.INSTRUCTOR, () => []),
	]);
	return optionManager;
};

export const fetchOptionData = createAsyncThunk('option/fetchOptionData', async (_, {}) => {
	try {
		const optionManager: OptionManagerType = await fetchOptionManager();
		return optionManager;
	} catch (error) {
		console.error(error);
	}
});

export const useInitialOptions = () => {
	const dispatch = useAppDispatch();
	const status = useAppSelector((state) => state.option.optionManager.status);
	const options = useAppSelector(selectOptions());

	useEffect(() => {
		if (status === 'idle') {
			dispatch(fetchOptionData());
		}
	}, [dispatch, status]);

	return options;
};
