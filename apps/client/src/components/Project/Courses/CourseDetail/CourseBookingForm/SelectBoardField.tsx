import React from 'react';
import { CourseSkiType } from '@repo/shared';

import SkiIcon from '@/components/Icon/SkiIcon';
import SnowBoardIcon from '@/components/Icon/SnowBoardIcon';

interface FormData {
	plan: string;
	boardType: number;
	participants: { adult: number; minor: number };
}

interface SelectBoardFieldProps {
	onChange: (value: number) => void;
	formData: FormData;
}

const SKI_OPTIONS = [
	{
		type: CourseSkiType.SKI,
		icon: <SkiIcon />,
		label: '雙板',
	},
	{
		type: CourseSkiType.SNOWBOARD,
		icon: <SnowBoardIcon />,
		label: '單板',
	},
];

export const SelectBoardField = ({ onChange, formData }: SelectBoardFieldProps) => {
	return (
		<div className='flex items-center text-sm gap-4 mt-3'>
			<div className='text-[#818181] courser-default'>板類</div>
			<div className='flex flex-1 items-center gap-[10px]'>
				{SKI_OPTIONS.map(({ type, label, icon }) => (
					<button
						key={label}
						type='button'
						onClick={() => onChange(type)}
						className={`flex items-center justify-center gap-[10px] flex-1 p-[10px] rounded-lg border border-solid font-[500] border-[#d7d7d7] ${formData.boardType === type ? 'bg-[#2b2b2b] text-[#ffffff]' : 'bg-[#ffffff] text-[#2b2b2b]'} `}
					>
						{icon}
						{label}
					</button>
				))}
			</div>
		</div>
	);
};
