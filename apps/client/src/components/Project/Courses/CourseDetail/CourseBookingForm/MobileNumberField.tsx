import React from 'react';

import TargetIcon from '@/components/Icon/TargetIcon';
interface NumberInputProps {
	label: string;
	participants: { adult: number; minor: number };
	handleClick: () => void;
}

export const MobileNumberField = ({ label, participants, handleClick }: NumberInputProps) => {
	return (
		<div className='flex gap-4 items-center mt-3 w-full leading-6' onClick={handleClick}>
			<label htmlFor={`input-${label}`} className='self-stretch my-auto text-sm text-[#818181]'>
				{label}
			</label>
			<div className='cursor-pointer flex flex-1 shrink items-center self-stretch py-2.5 pr-4 pl-3 my-auto text-base bg-white rounded-lg border border-solid basis-0 border-[#d7d7d7] min-h-[44px] min-w-[240px] text-[#2b2b2b]'>
				<TargetIcon size={24} />
				<div className='ml-2'>{participants.adult + participants.minor}</div>
				<span>人</span>
			</div>
		</div>
	);
};
