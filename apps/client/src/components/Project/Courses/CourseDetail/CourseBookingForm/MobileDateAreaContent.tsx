import React, { useState } from 'react';

import BackIcon from '@/components/Icon/BackIcon';
import MobileDatePicker from '@/components/Project/Shared/MobileDatePicker';
import { DrawerHeader } from '@/components/ui/drawer';

interface SelectFieldProps {
	value: string;
	onChange: (value: string) => void;
	handleBack: () => void;
}

export const MobileDateAreaContent = ({ value, onChange, handleBack }: SelectFieldProps) => {
	// 1 週 2 月
	const [mode, setMode] = useState(1);

	const handleSetMode = (mode: number) => {
		setMode(mode);
	};
	return (
		<div className='max-h-[100vh] flex flex-col'>
			<DrawerHeader className='h-[48px] pl-[24px] flex gap-[22px] items-center justify-between text-left border-b border-solid border-[#d7d7d7]'>
				<div className='flex gap-[22px] items-center justify-between'>
					<button type='button' onClick={handleBack}>
						<BackIcon />
					</button>
					方案
				</div>
				<div className='p-[4px] h-[34px] flex items-center border border-solid border-[#C1C1C1] rounded-[8px]'>
					<button
						type='button'
						className={`w-[46px] h-[24px] rounded-[4px] text-[14px] ${mode === 1 ? 'bg-[#2b2b2b] text-white' : ''}`}
						onClick={() => handleSetMode(1)}
					>
						週
					</button>
					<button
						type='button'
						className={`w-[46px] h-[24px] rounded-[4px] text-[14px] ${mode === 2 ? 'bg-[#2b2b2b] text-white' : ''}`}
						onClick={() => handleSetMode(2)}
					>
						月
					</button>
				</div>
			</DrawerHeader>
			<div className='h-[100%] overflow-y-scroll gap-4 items-center px-5 py-4 w-full leading-6'>
				<MobileDatePicker value={value} handleChange={onChange} handleBack={handleBack} mode={mode} />
			</div>
		</div>
	);
};
