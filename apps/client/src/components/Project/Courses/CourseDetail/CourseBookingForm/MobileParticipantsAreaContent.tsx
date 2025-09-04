import React, { useEffect, useState } from 'react';

import AddPeopleIcon from '@/components/Icon/AddPeopleIcon';
import BackIcon from '@/components/Icon/BackIcon';
import ReducePeopleIcon from '@/components/Icon/ReducePeopleIcon';
import TipIcon from '@/components/Icon/TipIcon';
import { DrawerHeader } from '@/components/ui/drawer';

interface SelectFieldProps {
	value: string;
	onChange: (value: { adult: number; minor: number }) => void;
	handleBack: () => void;
	participants: { adult: number; minor: number };
	max: number;
}

export const MobileParticipantsAreaContent = ({ value, onChange, handleBack, participants, max }: SelectFieldProps) => {
	const [adult, setAdult] = useState(1);
	const [minor, setMinor] = useState(0);

	const totalParticipants = adult + minor;
	const isMaxReached = max > 0 && totalParticipants >= max;

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
		handleBack();
	};

	useEffect(() => {
		handleReset();
	}, []);

	return (
		<div>
			<DrawerHeader className='h-[48px] pl-[24px] flex gap-[20px] items-center text-left border-b border-solid border-[#d7d7d7]'>
				<button type='button' onClick={handleBack}>
					<BackIcon />
				</button>
				人數
			</DrawerHeader>
			<div className='relative gap-4 items-center px-5 py-4 w-full leading-6'>
				<div className=''>
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
					<div className='flex items-center justify-between pt-[16px]'>
						{max > 0 ? (
							<div className='flex gap-[2px] items-center text-[14px] text-[#818181]'>
								<TipIcon />
								超過2人需加價，上限{max}人
							</div>
						) : (
							<div></div>
						)}
						<button
							type='button'
							className='w-[68px] flex items-center justify-center p-[10px] rounded-lg bg-[#2b2b2b] font-[500] text-[14px] text-[#ffffff]'
							onClick={handleChange}
						>
							確認
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};
