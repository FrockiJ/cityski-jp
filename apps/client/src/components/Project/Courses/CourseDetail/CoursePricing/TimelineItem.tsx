import React from 'react';
import { CoursePlanResponseDTO } from '@repo/shared';

interface TimelineItemProps {
	plan: CoursePlanResponseDTO;
	isFirst?: boolean;
	isLast?: boolean;
}

const formatSessionDate = (date: Date): string => {
	try {
		const d = new Date(date);
		if (isNaN(d.getTime())) return '';

		const year = d.getFullYear();
		const month = d.getMonth() + 1;
		const day = d.getDate();
		return `${year}/${month}/${day}`;
	} catch (error) {
		return '';
	}
};

const formatSessionTime = (startTime: Date, endTime: Date): string => {
	try {
		const start = new Date(startTime);
		const end = new Date(endTime);

		if (isNaN(start.getTime()) || isNaN(end.getTime())) {
			return '時間格式錯誤';
		}

		const startHour = start.getHours().toString().padStart(2, '0');
		const startMin = start.getMinutes().toString().padStart(2, '0');
		const endHour = end.getHours().toString().padStart(2, '0');
		const endMin = end.getMinutes().toString().padStart(2, '0');

		return `${startHour}:${startMin}-${endHour}:${endMin}`;
	} catch (error) {
		console.error('Time formatting error:', error);
		return '時間格式錯誤';
	}
};

export const TimelineItem: React.FC<TimelineItemProps> = ({ plan, isFirst, isLast }) => {
	return (
		<div className='relative flex gap-4'>
			{/* Left: Circle Dot - vertically centered with card */}
			<div className='relative w-3 flex-shrink-0 flex items-center'>
				<div className='w-3 h-3 rounded-full border-2 border-[#2b2b2b] bg-white relative z-10' />
			</div>

			{/* Right: Content Card */}
			<div className='flex-1 bg-[#f7f7f7] rounded-lg p-6 min-h-[120px] flex items-center'>
				<div className='flex items-center gap-8 w-full'>
					{/* Left: Plan name */}
					<div className='flex items-center justify-center flex-shrink-0 w-[120px] pr-8 border-r border-[#d7d7d7] self-stretch'>
						<div className='flex flex-col items-center gap-2'>
							<h3 className='text-base font-normal text-[#2b2b2b] whitespace-nowrap'>{plan.name}</h3>
							<div className='flex gap-2'>
								{plan.suggestion && (
									<span className='px-2 py-0.5 text-xs text-[#169b62] border border-[#169b62] rounded-full'>
										教練推薦
									</span>
								)}
								{plan.promotion && (
									<span className='px-2 py-0.5 text-xs text-[#ff6b35] border border-[#ff6b35] rounded-full'>
										{plan.promotion}
									</span>
								)}
							</div>
						</div>
					</div>

					{/* Middle: Sessions */}
					<div className='flex items-center flex-1 pr-8 border-r border-[#d7d7d7] self-stretch'>
						{!plan.sessions || plan.sessions.length === 0 ? (
							<div className='text-sm text-neutral-40 italic'>暫無課程時段</div>
						) : (
							<div className='space-y-2 w-full'>
								{plan.sessions.map((session) => (
									<div key={session.id} className='flex gap-4 text-base text-[#2b2b2b]'>
										<span className='inline-block w-[100px]'>{formatSessionDate(session.startTime)}</span>
										<span>{formatSessionTime(session.startTime, session.endTime)}</span>
									</div>
								))}
							</div>
						)}
					</div>

					{/* Right: Total Price */}
					<div className='flex items-center pl-4 pr-8'>
						<div className='flex items-baseline flex-shrink-0'>
							<span className='text-2xl font-medium text-[#2b2b2b]'>
								{plan.price && plan.number ? (plan.price * plan.number).toLocaleString() : '---'}
							</span>
							<span className='text-base text-[#2b2b2b] ml-1'>元</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
