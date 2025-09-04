import React from 'react';
import { CoursePlanResponseDTO, CourseType } from '@repo/shared';

import PrivateCourseIcon from '@/components/Icon/PrivateCourseIcon';
import TimeIcon from '@/components/Icon/TimeIcon';

import { CourseOption } from './CourseOption';

interface CoursePricingProps {
	title: string;
	courseOptions: CoursePlanResponseDTO[];
	courseType: CourseType;
}

const CoursePricing = ({ title, courseOptions, courseType }: CoursePricingProps) => {
	const hasLessTenLessons = courseOptions.some((plan) => plan.number <= 10);

	const formatCourseOptions = [];
	const eachRowCount = 5;
	const rowLen = Math.ceil(courseOptions.length / eachRowCount);
	for (let i = 0; i < rowLen; i++) {
		formatCourseOptions.push(courseOptions.slice(i * eachRowCount, i * eachRowCount + eachRowCount));
	}

	return (
		<section
			id='course-summary'
			className='flex flex-col self-stretch pb-12 pt-9 border-b border-solid border-b-zinc-[#d7d7d7] max-w-[780px]'
		>
			<h2 className='text-2xl font-medium tracking-tight leading-loose text-[#2b2b2b] max-xs:max-w-full'>{title}</h2>
			<div className='flex flex-col mt-6 w-full max-xs:max-w-full'>
				<div className='flex flex-col items-start w-full text-sm leading-6 text-[#2b2b2b] max-xs:max-w-full'>
					<div className='flex gap-2 items-center'>
						<TimeIcon />
						{hasLessTenLessons && <p>購買10堂課以內的課程，預約期限為半年</p>}
					</div>
					{courseType === CourseType.PRIVATE && (
						<div className='flex gap-2 items-center'>
							<PrivateCourseIcon />
							{hasLessTenLessons && <p>每班學員平日上限3人，週末上限4人</p>}
						</div>
					)}
				</div>

				<div className='rounded-xl overflow-hidden mt-4'>
					{formatCourseOptions.map((row, rowIndex) => (
						<div
							key={rowIndex}
							className={`
							hidden xs:flex flex-wrap items-center py-14 w-full bg-[#f7f7f7] max-xs:max-w-full 
						${rowLen - 1 !== rowIndex ? 'border-b border-solid border-b-[#ededed]' : ''}`}
						>
							{row.map((option) => (
								<CourseOption key={option.id} {...option} />
							))}
						</div>
					))}

					<div className='block xs:hidden bg-[#f7f7f7]'>
						{courseOptions.map((option) => (
							<CourseOption key={option.id} {...option} />
						))}
					</div>
				</div>
			</div>
		</section>
	);
};

export default CoursePricing;
