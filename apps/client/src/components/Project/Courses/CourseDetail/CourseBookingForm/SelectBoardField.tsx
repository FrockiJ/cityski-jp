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
	courseSkiType: number; // 課程的板類設定 (0=BOTH, 1=SNOWBOARD, 2=SKI)
}

const ALL_SKI_OPTIONS = [
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

export const SelectBoardField = ({ onChange, formData, courseSkiType }: SelectBoardFieldProps) => {
	// 根據課程類型過濾可用的板類選項
	const availableOptions = ALL_SKI_OPTIONS.filter((option) => {
		if (courseSkiType === CourseSkiType.BOTH) {
			return true; // 顯示所有選項
		}
		return option.type === courseSkiType; // 只顯示符合課程類型的選項
	});
	return (
		<div className='flex items-center text-sm gap-4 mt-3'>
			<div className='text-[#818181] courser-default'>板類</div>
			<div className='flex flex-1 items-center gap-[10px]'>
				{availableOptions.map(({ type, label, icon }) => (
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
