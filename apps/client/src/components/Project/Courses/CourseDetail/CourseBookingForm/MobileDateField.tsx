import React from 'react';

import CalendarIcon from '@/components/Icon/CalendarIcon';

interface MobileDateFieldProps {
	label: string;
	value: string;
	// participants: { adult: number; minor: number };
	handleClick: () => void;
	// max: number;
}

const MobileDateField = ({ label, value, handleClick }: MobileDateFieldProps) => {
	const date = new Date(value);
	const year = date.getFullYear();
	const month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
	const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
	const hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
	const mins = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();

	const formatDate = `${year}年${month}月${day}日 ${hour}:${mins}`;

	return (
		<div className='flex gap-4 items-center mt-3 w-full leading-6' onClick={handleClick}>
			<label htmlFor={`input-${label}`} className='self-stretch my-auto text-sm text-[#818181]'>
				{label}
			</label>
			<div className='cursor-pointer flex flex-1 shrink items-center self-stretch py-2.5 pr-4 pl-3 my-auto text-base bg-white rounded-lg border border-solid basis-0 border-[#d7d7d7] min-h-[44px] min-w-[240px] text-[#2b2b2b]'>
				<CalendarIcon />
				{value && <div className='ml-2'>{formatDate}</div>}
			</div>
		</div>
	);
};

export default MobileDateField;
