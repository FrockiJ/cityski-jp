'use client';

import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { CourseBkgType, CourseSkiType, CourseType, GetCourseDetailResponseDTO } from '@repo/shared';
import { useRouter } from 'next/navigation';

import { selectToken } from '@/state/slices/authSlice';
import { selectUserInfo } from '@/state/slices/authSlice';

import DateField from './DateField';
import { NumberField } from './NumberField';
import { SelectBoardField } from './SelectBoardField';
import { SelectField } from './SelectField';

interface CourseBookingFormProps {
	data: GetCourseDetailResponseDTO;
	onSubmit: (formData: OrderFormData) => void;
}

export interface OrderFormData {
	plan: string;
	boardType: number;
	participants: { adult: number; minor: number };
	date?: string;
	planType: number; // 0: 無, 1: 單堂體驗, 2: 固定堂數(每人), 3: 共用堂數, 4: 一般私人課
}

const CourseBookingForm = ({ data, onSubmit }: CourseBookingFormProps) => {
	const router = useRouter();
	const userInfo = useSelector(selectUserInfo);
	const accessToken = useSelector(selectToken);
	const [formData, setFormData] = useState<OrderFormData>({
		plan: '',
		boardType: null,
		participants: { adult: 1, minor: 0 },
		date: '',
		planType: data?.coursePlans?.[0]?.type || 0,
	});

	const handleChange = (name: keyof OrderFormData, value: string | number | { adult: number; minor: number }) => {
		if (name === 'plan') {
			const selectedPlan = data?.coursePlans?.find((plan) => plan.id === (value as string));
			setFormData((prevData) => ({
				...prevData,
				[name]: value as string,
				planType: selectedPlan?.type || 0,
			}));
		} else {
			setFormData((prevData) => ({ ...prevData, [name]: value }));
		}
	};

	// useEffect(() => {
	// 	console.log('data data:', data);
	// }, [data]);

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault();
		// check if user is logged in
		// turn off when testing
		// if (!userInfo && !accessToken) {
		// 	router.push('/login');
		// 	return;
		// }

		// Save form data to localStorage before navigating
		localStorage.setItem(
			'courseOrderData',
			JSON.stringify({
				courseId: data.id,
				formData,
				timestamp: formData.date ? new Date(formData.date).getTime() : undefined,
			}),
		);

		// Navigate to order page
		router.push(`/courses/${data.id}/order`);
	};

	useEffect(() => {
		if (!data) return;
		if (data.skiType === CourseSkiType.BOTH || data.skiType === CourseSkiType.SKI) {
			setFormData((prev) => ({
				...prev,
				plan: data.coursePlans?.[0].id,
				boardType: 2,
				planType: data.coursePlans?.[0].type,
			}));
		} else {
			setFormData((prev) => ({
				...prev,
				plan: data.coursePlans?.[0].id,
				boardType: 1,
				planType: data.coursePlans?.[0].type,
			}));
		}
	}, [data]);

	const totalPrice = 1600; // This should be calculated based on the form data
	return (
		<form
			onSubmit={handleSubmit}
			className='hidden xs:flex w-[max-content] flex-col p-7 bg-white rounded-2xl border border-solid shadow-lg border-[#d7d7d7] max-w-[360px]'
		>
			<h2 className='text-2xl font-medium tracking-tight leading-tight text-zinc-800'>{data?.name}</h2>
			<div className='flex flex-col mt-6 w-full'>
				{/* 方案 */}
				<SelectField
					label='方案'
					value={formData.plan}
					onChange={(value) => handleChange('plan', value)}
					plans={data?.coursePlans}
				/>
				{/* 板類 */}
				<SelectBoardField formData={formData} onChange={(value) => handleChange('boardType', value)} />
				{/* 人數 */}
				<NumberField
					label='人數'
					participants={formData.participants}
					onChange={(value) => handleChange('participants', value)}
					max={data?.type === CourseType.PRIVATE ? data?.coursePeople?.[0]?.maxPeople : 0}
					// showTip={data?.type === CourseType.PRIVATE}
				/>
				{/* 日期 */}
				{(formData.planType === 1 || data?.bkgType === CourseBkgType.FIXED) && (
					<DateField
						label='日期'
						value={formData.date}
						onChange={(value) => handleChange('date', value)}
						disabled={data?.bkgType === CourseBkgType.FIXED}
					/>
				)}
				<div className='flex gap-2 justify-end items-center pt-4 mt-5 w-full whitespace-nowrap border-t border-solid border-t-gray-200 text-zinc-800'>
					<div className='flex gap-2 items-center self-stretch my-auto'>
						<span className='self-stretch my-auto text-base font-medium'>總計</span>
						<div className='flex gap-0.5 items-center self-stretch my-auto'>
							<span className='self-stretch my-auto text-2xl font-semibold tracking-tighter leading-none'>
								{totalPrice.toLocaleString()}
							</span>
							<span className='self-stretch my-auto text-base font-medium'>元</span>
						</div>
					</div>
				</div>
			</div>
			<button
				type='submit'
				className='overflow-hidden gap-2.5 self-stretch px-6 py-5 mt-7 max-w-full text-base font-bold text-white whitespace-nowrap rounded-lg bg-[linear-gradient(99deg,#FE696C_0%,#FD8E4B_100%)] w-[335px] max-xs:w-full max-xs:px-5 transition-all duration-300 hover:opacity-90 hover:shadow-lg'
				aria-label='立即預訂'
			>
				立即預訂
			</button>
		</form>
	);
};

export default CourseBookingForm;
