import React, { useState } from 'react';

import AddPeopleIcon from '@/components/Icon/AddPeopleIcon';
import ReducePeopleIcon from '@/components/Icon/ReducePeopleIcon';
import TargetIcon from '@/components/Icon/TargetIcon';
import TipIcon from '@/components/Icon/TipIcon';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
interface NumberInputProps {
	label: string;
	participants: { adult: number; minor: number };
	onChange: (value: { adult: number; minor: number }) => void;
	max: number;
}

export const NumberField = ({ label, participants, onChange, max }: NumberInputProps) => {
	const [open, setOpen] = useState(false);
	const [adult, setAdult] = useState(1);
	const [minor, setMinor] = useState(0);

	const totalParticipants = adult + minor;
	const isMaxReached = max > 0 && totalParticipants >= max;

	const handleOpenModal = () => {
		setOpen(true);
	};

	const handleCloseModal = () => {
		setOpen(false);
	};

	const handleSetAdult = (value: number) => {
		if (value > 0 && isMaxReached) return;
		setAdult((prev) => prev + value);
	};

	const handleSetMinor = (value: number) => {
		if (value > 0 && isMaxReached) return;
		setMinor((prev) => prev + value);
	};

	const handleReset = () => {
		setAdult(participants.adult);
		setMinor(participants.minor);
	};
	const handleChange = () => {
		onChange({
			adult,
			minor,
		});
		handleCloseModal();
	};
	console.log('open', open);
	return (
		<div className='flex gap-4 items-center mt-3 w-full leading-6'>
			<label htmlFor={`input-${label}`} className='self-stretch my-auto text-sm text-[#818181]'>
				{label}
			</label>
			<Popover open={open} onOpenChange={handleReset}>
				<PopoverTrigger className={`flex-1 ${open ? 'pointer-events-none' : ''}`} onClick={handleOpenModal}>
					<div className='cursor-pointer flex flex-1 shrink items-center self-stretch py-2.5 pr-4 pl-3 my-auto text-base bg-white rounded-lg border border-solid basis-0 border-[#d7d7d7] min-h-[44px] min-w-[240px] text-[#2b2b2b]'>
						<TargetIcon size={24} />
						<div className='ml-2'>{participants.adult + participants.minor}</div>
						<span>人</span>
					</div>
				</PopoverTrigger>

				<PopoverContent onPointerDownOutside={handleCloseModal}>
					<div className='w-[360px]'>
						<div className='flex justify-between items-center py-[14px] border-b border-solid border-[#d7d7d7]'>
							<div>
								<div className='font-bold'>成人</div>
								<div className='text-[14px] text-[#818181]'>18歲以上</div>
							</div>
							<div>
								<div className='flex items-center'>
									<button disabled={adult < 1} type='button' onClick={() => handleSetAdult(-1)}>
										<ReducePeopleIcon disabled={adult < 1} />
									</button>
									<div className='mx-4'>{adult}</div>
									<button disabled={isMaxReached} type='button' onClick={() => handleSetAdult(1)}>
										<AddPeopleIcon disabled={isMaxReached} />
									</button>
								</div>
							</div>
						</div>

						<div className='flex justify-between items-center py-[14px] border-b border-solid border-[#d7d7d7]'>
							<div>
								<div className='font-bold'>青少年/兒童</div>
								<div className='text-[14px] text-[#818181]'>2.5歲 - 17歲</div>
							</div>
							<div className='flex items-center'>
								<button disabled={minor < 1} type='button' onClick={() => handleSetMinor(-1)}>
									<ReducePeopleIcon disabled={minor < 1} />
								</button>
								<div className='mx-4'>{minor}</div>
								<button disabled={isMaxReached} type='button' onClick={() => handleSetMinor(1)}>
									<AddPeopleIcon disabled={isMaxReached} />
								</button>
							</div>
						</div>
						<div className='flex items-center pt-[16px]'>
							<div className='flex flex-1 gap-[2px] items-center text-[14px] text-[#818181]'>
								{max > 0 && (
									<>
										<TipIcon />
										超過2人需加價，上限{max}人
									</>
								)}
							</div>

							<button
								type='button'
								className='w-[68px] flex items-center justify-center p-[10px] rounded-lg bg-[#2b2b2b] font-[500] text-[14px] text-[#ffffff]'
								onClick={handleChange}
							>
								確認
							</button>
						</div>
					</div>
				</PopoverContent>
			</Popover>
		</div>
	);
};
