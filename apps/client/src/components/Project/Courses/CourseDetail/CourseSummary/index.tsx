import React from 'react';
import { GetCourseDetailResponseDTO } from '@repo/shared';

import BonusIcon from '@/components/Icon/BonusIcon';
import TeachingTimeIcon from '@/components/Icon/TeachingTimeIcon';

import { FeatureTag } from './FeatureTag';

interface CourseSummaryProps {
	data: GetCourseDetailResponseDTO;
}

const CourseSummary = ({ data }: CourseSummaryProps) => {
	const promotion = data?.promotion && {
		icon: <BonusIcon />,
		text: (
			<>
				<span>{data?.promotion}</span>
			</>
		),
	};

	const teachingHours = {
		icon: <TeachingTimeIcon />,
		text: (
			<>
				課程時間 <span>{data?.length ? data?.length / 60 : 0}</span>小時
			</>
		),
	};

	return (
		<section className='flex flex-col self-stretch pb-12 border-b border-solid border-b-zinc-300 max-w-[780px] xs:w-[780px]'>
			<header className='flex flex-col w-full font-medium max-xs:max-w-full'>
				<h1 className='text-3xl tracking-tighter leading-none text-[#2b2b2b]'>{data?.name}</h1>
				<div className='flex gap-2 items-start self-start mt-4 text-sm leading-loose text-[rgb(46,123,190)]'>
					{promotion && <FeatureTag icon={promotion.icon} text={promotion.text} />}
					<FeatureTag icon={teachingHours.icon} text={teachingHours.text} />
				</div>
			</header>

			<p className='flex-1 shrink gap-2.5 mt-8 w-full text-base leading-7 text-ellipsis text-[#2b2b2b] max-xs:max-w-full'>
				{data?.description}
			</p>
		</section>
	);
};

export default CourseSummary;
