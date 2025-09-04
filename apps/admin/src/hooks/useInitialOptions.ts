import { useEffect } from 'react';
import { MultiValue } from 'react-select';
import { createAsyncThunk } from '@reduxjs/toolkit';
import {
	CourseBkgType,
	CourseStatusType,
	CourseType,
	DiscountStatus,
	MemberStatus,
	MemberType,
	Option,
	OptionManagerType,
	OptionNames,
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
