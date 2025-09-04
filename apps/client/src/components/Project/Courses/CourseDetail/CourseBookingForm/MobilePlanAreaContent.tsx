import React, { useEffect, useState } from 'react';
import { CoursePlanResponseDTO } from '@repo/shared';

import BackIcon from '@/components/Icon/BackIcon';
import { DrawerHeader } from '@/components/ui/drawer';

interface SelectFieldProps {
	value: string;
	onChange: (value: string) => void;
	handleBack: () => void;
	plans: CoursePlanResponseDTO[];
}

export const MobilePlanAreaContent = ({ value, onChange, handleBack, plans = [] }: SelectFieldProps) => {
	const [selected, setSelected] = useState<CoursePlanResponseDTO>();

	const handleSelected = (plan: CoursePlanResponseDTO) => {
		setSelected(plan);
		onChange(plan.id);
	};

	useEffect(() => {
		if (!plans || plans.length === 0) return;

		if (!value) {
			setSelected(plans[0]);
		} else {
			const targetPlan = plans.find((plan) => plan.id === value);
			setSelected(targetPlan);
		}
	}, [plans, value]);

	console.log('plans', plans);
	return (
		<div>
			<DrawerHeader className='h-[48px] pl-[24px] flex gap-[22px] items-center text-left border-b border-solid border-[#d7d7d7]'>
				<button type='button' onClick={handleBack}>
					<BackIcon />
				</button>
				方案
			</DrawerHeader>
			<div className='relative gap-4 items-center px-5 py-4 w-full leading-6'>
				{plans.map((plan: CoursePlanResponseDTO) => (
					<div
						key={plan.id}
						className={`flex [&:not(:first-child)]:mt-3 px-[20px] py-[22px] items-center justify-between cursor-pointer shrink-0 w-[auto] border border-solid border-[#d7d7d7] rounded-[6px] ${selected?.id === plan.id ? 'shadow-[0px_0px_0px_2px_#2b2b2b] border-[#2b2b2b]' : ''}`}
						onClick={() => handleSelected(plan)}
					>
						<div className='flex items-center font-bold'>
							<div className=''>{plan.name}</div>
							<div className='ml-1 translate-y-[1px]'>
								<span className='font-poppins'>{plan.number}堂</span>
								{/* <span className='ml-[2px]'>堂</span> */}
							</div>
						</div>
						<p className='font-poppins text-center font-[500] text-[20px]'>
							{plan.price.toLocaleString()}
							<span className='ml-[2px] font-[400] text-[14px] align-bottom'>元</span>
						</p>
					</div>
				))}
			</div>
		</div>
	);
};
