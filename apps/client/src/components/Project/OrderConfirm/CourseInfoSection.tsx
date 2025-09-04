import React from 'react';
import { CoursePlanResponseDTO, CourseSkiType, CourseType } from '@repo/shared';

import { Department } from '@/state/slices/infoSlice';

interface CourseInfoSectionProps {
	courseType: string;
	skiType: number;
	participants: {
		adult: number;
		minor: number;
	};
	plan: CoursePlanResponseDTO;
	department?: Department | null;
	timestamp?: number;
}

const courseTypeMap = {
	[CourseType.GROUP]: '團體班教學',
	[CourseType.PRIVATE]: '私人班教學',
	[CourseType.INDIVIDUAL]: '個人練習',
};

const skiTypeMap = {
	[CourseSkiType.SKI]: '雙板',
	[CourseSkiType.SNOWBOARD]: '單板',
	[CourseSkiType.BOTH]: '單板/雙板',
};

// const planTypeMap = {
// 	[0]: '無',
// 	[1]: '單堂體驗課',
// 	[2]: '固定堂數(每人)',
// 	[3]: '共用堂數',
// 	[4]: '一般私人課',
// };

function CourseInfoSection({ courseType, skiType, participants, plan, department, timestamp }: CourseInfoSectionProps) {
	console.log('plan:', plan);

	const formatDate = (timestamp: number) => {
		const date = new Date(timestamp);
		const year = date.getFullYear();
		const month = (date.getMonth() + 1).toString().padStart(2, '0');
		const day = date.getDate().toString().padStart(2, '0');
		const hours = date.getHours().toString().padStart(2, '0');
		const minutes = date.getMinutes().toString().padStart(2, '0');
		return {
			date: `${year}/${month}/${day}`,
			time: `${hours}:${minutes}`,
		};
	};

	return (
		<section className='pb-6 w-full border-b border-solid border-b-[color:var(--neutral-5,#D7D7D7)] max-xs:max-w-full'>
			<div className='flex flex-wrap gap-5 items-center p-3 w-full whitespace-nowrap rounded-xl border border-solid border-[color:var(--neutral-5,#D7D7D7)] min-h-[124px] text-zinc-800 max-xs:max-w-full max-xs:flex-row-reverse max-xs:justify-between'>
				<img
					src='https://cdn.builder.io/api/v1/image/assets/94845a89f25540f0bbe6b080603a926f/58d6de87550de834499c12af8f6097e2c0fb405f?placeholderIfAbsent=true'
					alt='Course thumbnail'
					className='object-contain shrink-0 self-stretch my-auto rounded-md aspect-square w-[100px]'
				/>
				<div className='self-stretch my-auto w-[185px] max-xs:w-auto'>
					<h2 className='text-xl font-medium leading-snug'>{courseType ? courseTypeMap[courseType] : ''}</h2>
					<div className='flex gap-4 items-center mt-2 w-full text-sm leading-6 max-xs:flex-col max-xs:items-start max-xs:gap-2'>
						<div className='inline-flex gap-1 items-center pr-4'>
							<img
								src='https://cdn.builder.io/api/v1/image/assets/94845a89f25540f0bbe6b080603a926f/4fb78566afe4950a4b9782882a228543d4a78cbe?placeholderIfAbsent=true'
								alt='Location icon'
								className='object-contain w-4 aspect-square'
							/>
							<span>{department?.name || '-'}</span>
						</div>
						<div className='flex shrink-0 w-px h-3.5 bg-zinc-300 max-xs:hidden' />
						<div className='inline-flex gap-1 items-center pr-4'>
							<img
								src='https://cdn.builder.io/api/v1/image/assets/94845a89f25540f0bbe6b080603a926f/99236f0f3883b7c9a8cc8de9bf70425e04fc1fb8?placeholderIfAbsent=true'
								alt='Plan icon'
								className='object-contain w-4 aspect-square'
							/>
							<span>{plan?.type === 1 ? '單堂體驗課' : plan?.name + plan?.number + '堂'}</span>
						</div>
						{plan?.promotion && (
							<div className='inline-flex gap-1 items-center'>
								<span className='rounded-[24px] border border-solid border-[#FE7B5D] text-[#FE7B5D] px-[10px] py-[6px] inline-flex items-center gap-1 h-[25px] leading-[10px]'>
									{plan.promotion}
								</span>
							</div>
						)}
					</div>
				</div>
			</div>
			<div className='mt-6 w-full text-justify max-xs:max-w-full'>
				<h3 className='text-xl font-medium leading-snug text-zinc-800'>課程資訊</h3>
				<div className='mt-2 w-full text-base max-xs:max-w-full'>
					<div className='flex flex-wrap gap-8 items-start py-6 w-full whitespace-nowrap border-b border-solid border-b-[color:var(--neutral-3,#EDEDED)] min-h-[72px] max-xs:max-w-full'>
						<div className='w-16 text-zinc-500'>板類</div>
						<div className='font-medium text-zinc-800'>{skiTypeMap[skiType]}</div>
					</div>
					<div
						className={`flex flex-wrap gap-8 items-center py-6 w-full ${plan?.type === 1 && timestamp ? 'border-b border-solid border-b-[color:var(--neutral-3,#EDEDED)]' : ''} min-h-[72px] max-xs:max-w-full`}
					>
						<div className='self-stretch my-auto w-16 text-zinc-500'>人數</div>
						<div className='self-stretch my-auto font-medium leading-6 text-zinc-800'>
							<span
								style={{
									fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
								}}
							>
								{participants?.adult > 0 && `${participants.adult} 成人`}
								{participants?.adult > 0 && participants?.minor > 0 && ' + '}
								{participants?.minor > 0 && `${participants.minor} 青少年/兒童`}
							</span>
						</div>
					</div>
					{plan?.type === 1 && timestamp && (
						<div className='flex flex-wrap gap-8 items-start py-6 w-full whitespace-nowrap max-xs:max-w-full'>
							<div className='w-16 text-zinc-500'>時間</div>
							<div className='flex flex-col justify-center font-medium text-zinc-800'>
								<TimeSlot {...formatDate(timestamp)} />
							</div>
						</div>
					)}
				</div>
			</div>
		</section>
	);
}

function TimeSlot({ date, time }: { date: string; time: string }) {
	return (
		<div className='flex gap-2 items-start mt-1 first:mt-0'>
			<div className='w-[90px]'>{date}</div>
			<div>{time}</div>
		</div>
	);
}

export default CourseInfoSection;
