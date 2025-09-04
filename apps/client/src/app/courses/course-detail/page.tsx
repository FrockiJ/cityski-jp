'use client';
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { CourseBkgType, CourseCancelPolicyType, GetCourseDetailResponseDTO, ResponseWrapper } from '@repo/shared';
import { useSearchParams } from 'next/navigation';

import CourseBookingForm from '@/components/Project/Courses/CourseDetail/CourseBookingForm';
import MobileBookingForm from '@/components/Project/Courses/CourseDetail/CourseBookingForm/MobileBookingForm';
import CourseInfoSection from '@/components/Project/Courses/CourseDetail/CourseInfoSection';
import CoursePricing from '@/components/Project/Courses/CourseDetail/CoursePricing';
import CourseSummary from '@/components/Project/Courses/CourseDetail/CourseSummary';
import HeroSection from '@/components/Project/Courses/CourseDetail/HeroSection';
import MobileHeroSection from '@/components/Project/Courses/CourseDetail/HeroSection/MobileHeroSection';
import RecommendedCourses from '@/components/Project/Courses/CourseDetail/RecommendedCourses';
import CancellationPolicy from '@/components/Project/Shared/CancellationPolicy';
import LeavePolicy from '@/components/Project/Shared/LeavePolicy/LeavePolicy';
import NoticeSection from '@/components/Project/Shared/Notice/NoticeSection';
import axios from '@/lib/api';

const CourseDetailPage = () => {
	const searchParams = useSearchParams();

	const id = searchParams.get('id');
	const [courseDetail, setCourseDetail] = useState<GetCourseDetailResponseDTO>();

	const handleSubmit = (formData: {
		plan: string;
		boardType: number;
		participants: { adult: number; minor: number };
	}) => {
		console.log('Form submitted with data:', formData);
	};

	useEffect(() => {
		if (!id) return;
		const getCourseDetail = async (id: string) => {
			const response = await axios.get<ResponseWrapper<GetCourseDetailResponseDTO>>(`/api/courses/client/${id}/detail`);
			// console.log('response courses', response);
			if (response.status === 200 && response.data?.result) {
				setCourseDetail(response.data.result);
			}
		};
		getCourseDetail(id);
	}, [id]);

	const images =
		courseDetail?.attachments.map((image) => ({
			id: image.id,
			src: process.env.NEXT_PUBLIC_AWS_S3_URL + image.key,
		})) || [];

	const plans = courseDetail?.coursePlans || [];

	const infos = courseDetail?.courseInfos.reduce((pre, cur) => {
		const data = [...pre];
		const target = data.find((item) => item.type === cur.type);
		if (target) {
			target.explanations.push(cur.explanation);
		} else {
			data.push({
				id: cur.id,
				type: cur.type,
				explanations: [cur.explanation],
			});
		}
		return data;
	}, []);

	let policy = [];
	// flexible
	if (courseDetail?.bkgType === CourseBkgType.FLEXIBLE) {
		policy = [
			{
				id: 'today',
				type: CourseCancelPolicyType.CANCEL_WITHIN_DEADLINE_PAY,
				days: '',
				condition: '課程當日',
				sequence: 1,
				fee: `臨時請假需出示醫師證明或報案三聯單。`,
			},
		];
		policy = [
			...policy,
			...courseDetail?.courseCancelPolicies.reduce((pre, cur) => {
				let data = [...pre];
				if (cur.sequence < courseDetail.courseCancelPolicies.length) {
					data = [
						...data,
						{
							id: cur.id,
							type: cur.type,
							days: cur.beforeDay + (cur.withinDay ? `-${cur.withinDay}` : ''),
							condition: '日內',
							sequence: cur.sequence + 1,
							fee: `更改時段酌收時段費${cur.price} 元/人，於上課當日繳交。`,
						},
					];
				} else if (cur.sequence === courseDetail.courseCancelPolicies.length) {
					data = [
						...data,
						{
							id: cur.id,
							type: cur.type,
							days: cur.beforeDay,
							condition: '日以上',
							sequence: cur.sequence + 1,
							fee: `可免費更改時段，以 1 次為限。`,
						},
					];
				}
				console.log('data', data);
				return data;
			}, []),
		];
	}
	// fixed
	else if (courseDetail?.bkgType === CourseBkgType.FIXED) {
		policy = [
			{
				id: 'today',
				type: CourseCancelPolicyType.CANCEL_WITHIN_DEADLINE_PAY,
				days: '',
				condition: '課程當日',
				sequence: 1,
				fee: `依取消辦法申請退費。`,
			},
		];
		policy = [
			...policy,
			...courseDetail?.courseCancelPolicies.reduce((pre, cur) => {
				let data = [...pre];

				data = [
					...data,
					{
						id: cur.id,
						type: cur.type,
						days: cur.beforeDay,
						condition: cur.sequence === 1 ? '日內' : '日以上',
						sequence: cur.sequence + 1,
						fee: cur.sequence === 1 ? `依取消辦法申請退費。` : '在尚有時段/梯次名額下，可免費更改時間。',
					},
				];
				return data;
			}, []),
		];
	}
	policy = policy.sort((a, b) => b.sequence - a.sequence);

	return (
		<>
			<div className='max-w-[1200px] mx-auto pt-[48px] max-xs:pt-0'>
				<div>
					{/* Hide HeroSection on xs screens */}
					<div className='max-xs:hidden'>{images.length === 6 && <HeroSection images={images} />}</div>

					{/* Show mobile hero section on xs screens */}
					<div className='hidden max-xs:block'>{images.length === 6 && <MobileHeroSection images={images} />}</div>
				</div>
				<div className='relative mt-10 flex flex-col md:flex-row gap-[60px]'>
					<div className='flex-1 max-xs:px-5 w-full'>
						{/* Left column */}
						<CourseSummary data={courseDetail} />
						<CoursePricing title='方案詳情' courseOptions={plans} courseType={courseDetail?.type} />
						<CourseInfoSection title='課程資訊' items={infos} />
						<NoticeSection />
						<LeavePolicy title='請假辦法' bkgType={courseDetail?.bkgType} data={policy} />
						<CancellationPolicy
							title='取消辦法'
							description='請參考'
							linkText='課程約定事項'
							linkHref='/course-terms'
						/>
					</div>
					<div className='hidden xs:block sticky top-[150px] w-[400px] h-[440px]'>
						{/* Right column */}
						<CourseBookingForm onSubmit={handleSubmit} data={courseDetail} />
					</div>
				</div>
				<div className='max-xs:px-5 w-full'>
					<RecommendedCourses courseId={id} departmentId={courseDetail?.departmentId} />
				</div>
			</div>

			{courseDetail && createPortal(<MobileBookingForm data={courseDetail} onSubmit={handleSubmit} />, document.body)}
		</>
	);
};

export default CourseDetailPage;
