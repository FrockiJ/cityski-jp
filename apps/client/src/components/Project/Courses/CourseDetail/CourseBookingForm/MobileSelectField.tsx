import React from 'react';
import { CoursePlanResponseDTO } from '@repo/shared';

import DropDownIcon from '@/components/Icon/DropDownIcon';

interface SelectFieldProps {
	label: string;
	value: string;
	plans: CoursePlanResponseDTO[];
	handleClick: () => void;
}

export const MobileSelectField = ({ label, value, plans = [], handleClick }: SelectFieldProps) => {
	const targetPlan = plans.find((plan) => plan.id === value);
	console.log('targetPlan', targetPlan);
	return (
		<div className='flex relative gap-4 items-center mt-3 w-full leading-6' onClick={handleClick}>
			<label htmlFor={`select-${label}`} className='self-stretch my-auto text-sm text-[#818181]'>
				{label}
			</label>
			<div className='relative flex-1 text-left items-start self-stretch my-auto text-base bg-white rounded-lg border border-solid basis-0 border-zinc-300 min-h-[44px] min-w-[240px] text-[#2b2b2b]'>
				<div className='p-[10px] appearance-none bg-transparent w-full'>
					{targetPlan.name}
					{targetPlan.number}堂
				</div>

				<div className='absolute right-[10px] m-auto h-[fit-content] top-0 bottom-0'>
					<DropDownIcon />
				</div>
			</div>
		</div>
	);
};
