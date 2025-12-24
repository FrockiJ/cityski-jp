'use client';

import { useEffect, useMemo, useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

import Button from '../Common/Button';

type DayType = {
	date: string;
	isCurrentMonth: boolean;
	isToday: boolean;
	isSelected: boolean;
	isPast?: boolean;
};

function isSameDate(date1, date2) {
	return date1.toISOString().slice(0, 10) === date2.toISOString().slice(0, 10);
}

// Generate dynamic dates for the current month and surrounding days
const generateDays = (year: number, month: number, selectedDay: string) => {
	console.log('selectedDay', selectedDay);
	const daysInMonth = new Date(year, month + 1, 0).getDate();
	const firstDayOfMonth = new Date(year, month, 1).getDay();
	const days = [];
	const today = new Date();
	today.setHours(0, 0, 0, 0); // Reset to start of day for comparison

	// Add previous month's days to fill the grid
	const prevMonthDays = new Date(year, month, 0).getDate();
	for (let i = firstDayOfMonth; i > 0; i--) {
		const dateObj = new Date(Date.UTC(year, month - 1, prevMonthDays - i + 1));
		days.push({
			date: dateObj.toISOString().split('T')[0],
			isCurrentMonth: false,
			isPast: dateObj < today,
		});
	}

	// Add current month's days
	for (let i = 1; i <= daysInMonth; i++) {
		const currentDate = new Date(Date.UTC(year, month, i));
		days.push({
			date: currentDate.toISOString().split('T')[0],
			isCurrentMonth: true,
			isToday: currentDate.toDateString() === new Date().toDateString(),
			isSelected: !selectedDay ? false : isSameDate(new Date(selectedDay), currentDate), // Example for selected date
			isPast: currentDate < today,
		});
	}

	// Add next month's days to fill the grid
	const daysToFill = 7 - (days.length % 7);
	if (daysToFill === 7) return days;

	for (let i = 1; i <= daysToFill; i++) {
		const nextMonthDate = new Date(Date.UTC(year, month + 1, i));
		days.push({
			date: nextMonthDate.toISOString().split('T')[0],
			isCurrentMonth: false,
			isPast: nextMonthDate < today,
		});
	}

	return days;
};

type DatePickerProps = {
	value: string;
	handleChange: (value: string) => void;
	handleCloseModal: () => void;
	reservedDateTimes?: string[]; // 已預約的日期時間列表 (ISO格式)
	fullyBookedSlots?: string[]; // 已滿的時段列表 (ISO格式，每時段>=2個預約)
};
export default function DatePicker({ value, handleChange, handleCloseModal, reservedDateTimes = [], fullyBookedSlots = [] }: DatePickerProps) {
	console.log('value', value);
	const [currentDate, setCurrentDate] = useState(new Date());
	// default selected today
	const [selectedDay, setSelectedDay] = useState<DayType>({
		date: new Date().toISOString().split('T')[0],
		isCurrentMonth: true,
		isToday: true,
		isSelected: true,
	});
	const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined);
	console.log('selectedTime', selectedTime);

	const handlePrevMonth = () => {
		setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
	};

	const handleNextMonth = () => {
		setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
	};

	const handleSelectedDay = (day: DayType) => {
		// console.log('selectedDay', day);
		// const selectedDay = new Date(day.date);
		// console.log('selectedDay', selectedDay);
		setSelectedDay(day);
		// 換日時清除已選擇的時段
		setSelectedTime(undefined);
	};

	const handleSelectedTime = (time: string) => {
		setSelectedTime(time);
	};

	const days = generateDays(currentDate.getFullYear(), currentDate.getMonth(), selectedDay?.date);

	const times = [
		'09:00',
		'10:00',
		'11:00',
		'12:00',
		'13:00',
		'14:00',
		'15:00',
		'16:00',
		'17:00',
		'18:00',
		'19:00',
		'20:00',
	];

	// 計算當前選擇日期的已預約時段和已滿時段
	const disabledTimes = useMemo(() => {
		if (!selectedDay.date) return [];

		// 1. 獲取當前訂單已預約的時段
		const reservedTimes = reservedDateTimes
			.filter(dateTime => {
				const reservedDate = new Date(dateTime);
				const reservedDateStr = reservedDate.toISOString().split('T')[0];
				return reservedDateStr === selectedDay.date;
			})
			.map(dateTime => {
				const reservedDate = new Date(dateTime);
				const hours = reservedDate.getHours().toString().padStart(2, '0');
				const minutes = reservedDate.getMinutes().toString().padStart(2, '0');
				return `${hours}:${minutes}`;
			});

		// 2. 獲取已滿的時段（其他課程預約數>=2）
		const fullyBookedTimes = fullyBookedSlots
			.filter(dateTime => {
				const bookedDate = new Date(dateTime);
				const bookedDateStr = bookedDate.toISOString().split('T')[0];
				return bookedDateStr === selectedDay.date;
			})
			.map(dateTime => {
				const bookedDate = new Date(dateTime);
				const hours = bookedDate.getHours().toString().padStart(2, '0');
				const minutes = bookedDate.getMinutes().toString().padStart(2, '0');
				return `${hours}:${minutes}`;
			});

		// 3. 合併兩個列表並去重
		return Array.from(new Set([...reservedTimes, ...fullyBookedTimes]));
	}, [selectedDay.date, reservedDateTimes, fullyBookedSlots]);

	const handleSubmit = () => {
		handleChange(selectedDay.date + ' ' + selectedTime);
	};
	function classNames(...classes) {
		return classes.filter(Boolean).join(' ');
	}

	useEffect(() => {
		if (!value) return;

		setSelectedDay({
			date: new Date(value).toISOString().split('T')[0],
			isCurrentMonth: true,
			isToday: new Date(value).toDateString() === new Date().toDateString(),
			isSelected: true,
		});

		const date = new Date(value);
		const mins = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
		const hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
		setSelectedTime(`${hour}:${mins}`);
	}, [value]);

	// todo: 每天的小時不共用 每天要有自己的可選小時
	return (
		<div className='w-[730px] grid grid-cols-2 divide-x divide-gray-200'>
			<div className='p-4 pt-3 '>
				<div className='flex items-center'>
					<button
						type='button'
						className='-my-1.5 flex self-end flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500 rounded-full border border-gray-300'
						onClick={handlePrevMonth}
					>
						<span className='sr-only'>Previous month</span>
						<ChevronLeftIcon className='size-5' aria-hidden='true' />
					</button>
					<h2 className='flex-auto text-lg font-medium text-gray-900 text-center tracking-wide'>
						{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
					</h2>
					<button
						type='button'
						className='-my-1.5 -mr-1.5 ml-2 flex  self-end flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500 rounded-full border border-gray-300'
						onClick={handleNextMonth}
					>
						<span className='sr-only'>Next month</span>
						<ChevronRightIcon className='size-5' aria-hidden='true' />
					</button>
				</div>
				<div className='border-b border-gray-200 mt-5'></div>
				<div className='mt-5 grid grid-cols-7 text-center text-xs/6 text-gray-500'>
					<div>日</div>
					<div>一</div>
					<div>二</div>
					<div>三</div>
					<div>四</div>
					<div>五</div>
					<div>六</div>
				</div>
				<div className='mt-2 grid grid-cols-7 text-sm'>
					{days.map((day, dayIdx) => (
						<div key={day.date} className='py-2'>
							<button
								type='button'
								disabled={day.isCurrentMonth === false || day.isPast}
								className={classNames(
									day.isSelected && 'text-white',
									!day.isSelected && day.isToday && 'border border-gray-900',
									!day.isSelected && !day.isToday && day.isCurrentMonth && !day.isPast && 'text-gray-900',
									!day.isSelected && !day.isToday && !day.isCurrentMonth && 'text-gray-400',
									!day.isSelected && day.isPast && 'text-gray-400 cursor-not-allowed',
									day.isSelected && day.isToday && 'bg-gray-900',
									day.isSelected && !day.isToday && 'bg-gray-900',
									// !day.isSelected && 'hover:bg-gray-200',
									(day.isSelected || day.isToday) && 'font-semibold',
									'mx-auto flex size-8 items-center justify-center rounded-full',
								)}
								onClick={() => handleSelectedDay(day)}
							>
								<time dateTime={day.date}>{day.date.split('-').pop().replace(/^0/, '')}</time>
							</button>
						</div>
					))}
				</div>
			</div>
			<section className='p-4 pt-3 flex flex-col h-full'>
				<h2 className='text-lg font-medium text-gray-900 text-center'>選擇時段</h2>
				<div className='border-b border-[#D7D7D7] mt-5'></div>
				<div className={`grid gap-3 my-4 ${times.length <= 12 ? 'grid-cols-3' : 'grid-cols-4'}`}>
					{times.map((time, index) => (
						<div
							key={index}
							className={classNames(
								selectedTime === time && 'text-white bg-gray-900 hover:bg-gray-900',
								disabledTimes.includes(time) && 'pointer-events-none text-[#ACACAC] bg-[#EDEDED]',
								'group flex justify-center border cursor-pointer border-gray-200 items-center gap-x-4 rounded-xl px-2 py-1 h-11  focus-within:bg-gray-100 hover:bg-gray-100 ',
							)}
							onClick={() => handleSelectedTime(time)}
						>
							<p className='text-sm font-medium select-none'>{time}</p>
						</div>
					))}
				</div>
				<div className='flex justify-end gap-x-2 mt-auto'>
					<Button variant='secondary' onClick={handleCloseModal}>
						取消
					</Button>
					<Button disabled={!selectedTime} onClick={handleSubmit}>確認</Button>
				</div>
			</section>
		</div>
	);
}
