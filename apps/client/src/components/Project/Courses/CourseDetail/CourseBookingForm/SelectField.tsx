import React, { useEffect, useState } from 'react';
import { CoursePlanResponseDTO, CoursePlanType } from '@repo/shared';

import DropDownIcon from '@/components/Icon/DropDownIcon';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface SelectFieldProps {
	label: string;
	value: string;
	onChange: (value: string) => void;
	plans: CoursePlanResponseDTO[];
}

export const SelectField = ({ label, value, onChange, plans = [] }: SelectFieldProps) => {
	const [selected, setSelected] = useState<CoursePlanResponseDTO>();

	const handleSelected = (plan: CoursePlanResponseDTO) => {
		setSelected(plan);
		onChange(plan.id);
	};

	useEffect(() => {
		if (!plans || plans.length === 0) return;
		setSelected(plans[0]);
	}, [plans]);

	const formatPlans = [];
	const eachRowCount = 3;
	const rowLen = Math.ceil(plans.length / eachRowCount);
	for (let i = 0; i < rowLen; i++) {
		formatPlans.push(plans.slice(i * eachRowCount, i * eachRowCount + eachRowCount));
	}

	return (
		<div>
			<div className='flex relative gap-4 items-center mt-3 w-full leading-6'>
				<label htmlFor={`select-${label}`} className='self-stretch my-auto text-sm text-[#818181]'>
					{label}
				</label>
				<Popover>
					<PopoverTrigger className='flex-1'>
						<div className='relative text-left items-start self-stretch my-auto text-base bg-white rounded-lg border border-solid basis-0 border-zinc-300 min-h-[44px] min-w-[240px] text-[#2b2b2b]'>
							<div className='p-[10px] appearance-none bg-transparent w-full'>
								{selected?.type === CoursePlanType.SINGLE_SESSION
									? '單堂體驗課'
									: selected?.name + selected?.number + '堂'}
							</div>

							<div className='absolute right-[10px] m-auto h-[fit-content] top-0 bottom-0'>
								<DropDownIcon />
							</div>
						</div>
					</PopoverTrigger>
					<PopoverContent>
						<div>
							{formatPlans.map((row, rowIndex) => (
								<div key={rowIndex} className={`flex gap-2 ${rowIndex !== 0 ? 'mt-2' : ''}`}>
									{row.map((plan: CoursePlanResponseDTO) => (
										<div
											key={plan.id}
											className={`cursor-pointer shrink-0 w-[144px] h-[147px] border border-solid border-[#d7d7d7] rounded-[6px] ${selected?.id === plan.id ? 'shadow-[0px_0px_0px_1px_#2b2b2b] border-[#2b2b2b]' : ''}`}
											onClick={() => handleSelected(plan)}
										>
											{/* 單堂體驗 */}
											{plan.type === CoursePlanType.SINGLE_SESSION ? (
												<div className='font-bold mx-[12px] mt-[20px] flex justify-center items-center h-[75px] border-b border-solid border-[#EDEDED] '>
													單堂體驗課
												</div>
											) : (
												<div className='flex flex-col mx-[12px] mt-[20px] justify-center items-center h-[75px] border-b border-solid border-[#EDEDED]'>
													<div className='text-[13px]'>{plan.name}</div>
													<div className='ml-[12px]'>
														<span className='text-[36px] font-poppins font-[500]'>{plan.number}</span>
														<span className='align-super text-[12px] ml-[2px]'>堂</span>
													</div>
												</div>
											)}

											<p className='font-poppins text-center mt-2 font-[500]'>
												{(plan.price * plan.number).toLocaleString()}
												<span className='ml-[2px] font-[400] text-[14px]'>元</span>
											</p>
										</div>
									))}
								</div>
							))}
						</div>
					</PopoverContent>
				</Popover>
			</div>
		</div>
	);
};
