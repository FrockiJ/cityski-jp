import React, { useState } from 'react';

import CalendarIcon from '@/components/Icon/CalendarIcon';
import DatePicker from '@/components/Project/Shared/DatePicker';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface DateFieldProps {
	label: string;
	value: string;
	// participants: { adult: number; minor: number };
	onChange: (value: string) => void;
	// max: number;
	disabled?: boolean;
}

const DateField = ({ label, value, onChange, disabled }: DateFieldProps) => {
	const [open, setOpen] = useState(false);

	const handleOpenModal = () => {
		if (disabled) return;
		setOpen(true);
	};

	const handleCloseModal = () => {
		setOpen(false);
	};

	const handleReset = () => {};
	const handleChange = (value: string) => {
		handleCloseModal();
		onChange(value);
	};

	const date = new Date(value);
	const year = date.getFullYear();
	const month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
	const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
	const hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
	const mins = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();

	const formatDate = `${year}年${month}月${day}日 ${hour}:${mins}`;

	return (
		<div className='flex gap-4 items-center mt-3 w-full leading-6'>
			<label htmlFor={`input-${label}`} className='self-stretch my-auto text-sm text-[#818181]'>
				{label}
			</label>
			<Popover open={open} onOpenChange={handleReset}>
				<PopoverTrigger className={`flex-1 ${open ? 'pointer-events-none' : ''}`} onClick={handleOpenModal}>
					<div
						className={`cursor-pointer flex flex-1 shrink items-center self-stretch py-2.5 pr-4 pl-3 my-auto text-base bg-white rounded-lg border border-solid basis-0 border-[#d7d7d7] min-h-[44px] min-w-[240px] text-[#2b2b2b] ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
					>
						<CalendarIcon />
						<div className='ml-2'>{disabled ? '依照課程排定時段' : value && formatDate}</div>
					</div>
				</PopoverTrigger>

				<PopoverContent onPointerDownOutside={handleCloseModal} className='p-0'>
					<div>
						<DatePicker value={value} handleChange={handleChange} handleCloseModal={handleCloseModal} />
					</div>
				</PopoverContent>
			</Popover>
		</div>
	);
};

export default DateField;
