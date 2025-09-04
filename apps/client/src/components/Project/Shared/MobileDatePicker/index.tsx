'use client';

import { useEffect, useLayoutEffect, useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

import Button from '../Common/Button';

type DayType = {
	date: string;
	isCurrentMonth: boolean;
	isToday: boolean;
	isSelected: boolean;
};

function isSameDate(date1, date2) {
	return date1.toISOString().slice(0, 10) === date2.toISOString().slice(0, 10);
}

// Generate dynamic dates for the current month and surrounding days
const generateDays = (year: number, month: number, selectedDay?: string) => {
	const daysInMonth = new Date(year, month + 1, 0).getDate();
	const firstDayOfMonth = new Date(year, month, 1).getDay();
	const days = [];
	console.log('daysInMonth', daysInMonth);

	// Add previous month's days to fill the grid
	const prevMonthDays = new Date(year, month, 0).getDate();
	for (let i = firstDayOfMonth; i > 0; i--) {
		days.push({
			date: new Date(Date.UTC(year, month - 1, prevMonthDays - i + 1)).toISOString().split('T')[0],
			isCurrentMonth: false,
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
		});
	}

	// Add next month's days to fill the grid
	const daysToFill = 7 - (days.length % 7);
	if (daysToFill === 7) return days;

	for (let i = 1; i <= daysToFill; i++) {
		const nextMonthDate = new Date(Date.UTC(year, month + 1, i));
		days.push({ date: nextMonthDate.toISOString().split('T')[0], isCurrentMonth: false });
	}

	return days;
};

const generateOneWeekDays = (days, weekIndex?: number, weekLastIndex?: number) => {
	const thisMonthLastRowIndex = Math.floor((days.length - 1) / 7);
	if (weekIndex > thisMonthLastRowIndex) {
		return null;
	}
	if (weekIndex < 0) {
		return { weekIndex: thisMonthLastRowIndex };
	}

	const toDayIndex = days.findIndex((day) => day.isToday);
	// 一排7天
	const toDayRowIndex = weekIndex ?? (toDayIndex === -1 ? 0 : Math.floor(toDayIndex / 7));

	// 當週星期一的index
	const currentWeekFirstDayIndex = toDayRowIndex * 7;
	// 取得當週7天
	const weekDays = days.slice(currentWeekFirstDayIndex, currentWeekFirstDayIndex + 7);
	// 獲得最後一排的index, index從0開始所以長度要扣1

	// 目前顯示那週的index
	const currentWeekIndex = weekIndex ?? toDayRowIndex;

	return {
		weekDays,
		weekIndex: currentWeekIndex,
		isLastIndex: weekLastIndex === thisMonthLastRowIndex,
		lastIndex: thisMonthLastRowIndex,
	};
};

type DatePickerProps = {
	handleChange: (value: string) => void;
	handleBack: () => void;
	value: string;
	mode: number;
};
export default function DatePicker({ value, handleBack, handleChange, mode }: DatePickerProps) {
	const [currentDate, setCurrentDate] = useState(new Date());
	// default selected today
	const [selectedDay, setSelectedDay] = useState<DayType>({
		date: new Date().toISOString().split('T')[0],
		isCurrentMonth: true,
		isToday: true,
		isSelected: true,
	});
	const [selectedTime, setSelectedTime] = useState<string>();

	const [weekIndex, setWeekIndex] = useState<number>(null);

	const [days, setDays] = useState([]);
	const [weekDays, setWeekDays] = useState([]);

	const handlePrev = () => {
		if (mode === 1) {
			if (weekIndex === 0) {
				const days = generateDays(currentDate.getFullYear(), currentDate.getMonth() - 1, selectedDay?.date);
				const prevWeekDays = generateOneWeekDays(days, weekIndex - 1);
				setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
				setWeekDays([]);
				setWeekIndex(prevWeekDays.weekIndex);
			} else {
				const weekDays = generateOneWeekDays(days, weekIndex - 1);
				setWeekDays(weekDays.weekDays);
				setWeekIndex(weekDays.weekIndex);
			}
		} else {
			setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
		}
	};

	const handleNext = () => {
		if (mode === 1) {
			const weekDays = generateOneWeekDays(days, weekIndex + 1);
			if (!weekDays) {
				setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
				setWeekDays([]);
				setWeekIndex(0);
			} else {
				setWeekDays(weekDays.weekDays);
				setWeekIndex(weekDays.weekIndex);
			}
		} else {
			setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
		}
	};

	const handleSelectedDay = (day: DayType) => {
		setSelectedDay(day);
	};

	const handleSelectedTime = (time: string) => {
		setSelectedTime(time);
	};

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

	const disabledTimes = ['09:00', '15:00'];

	const handleSubmit = () => {
		if (selectedDay.date && selectedTime) {
			handleChange(new Date(selectedDay.date + ' ' + selectedTime).toISOString());
			handleBack();
		}
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

	let formattedDate = '';
	if (selectedDay.date && selectedTime) {
		const date = new Date(selectedDay.date + ' ' + selectedTime);

		formattedDate = date.toLocaleString('zh-TW', {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
			hour: '2-digit',
			minute: '2-digit',
			hour12: false,
		});
	}

	useLayoutEffect(() => {
		const days = generateDays(currentDate.getFullYear(), currentDate.getMonth(), selectedDay?.date);
		setDays(days);
	}, [currentDate, selectedDay]);

	// 週的流程可再優化
	useLayoutEffect(() => {
		if (!days || days.length === 0) return;
		// 週
		if (mode === 1) {
			const weekDays = generateOneWeekDays(days, weekIndex);
			setWeekDays(weekDays.weekDays);
			setWeekIndex(weekDays.weekIndex);
		}
	}, [days, mode]);

	// todo: 每天的小時不共用 每天要有自己的可選小時
	return (
		<div className='mb-[60px]'>
			<div className='w-[100%] grid grid-cols-1'>
				<div>
					<div className='flex items-center'>
						<button
							type='button'
							className='-my-1.5 flex self-end flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500 rounded-full border border-gray-300'
							onClick={handlePrev}
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
							onClick={handleNext}
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
						{(mode === 1 ? weekDays : days).map((day, dayIdx) => (
							<div key={day.date} className='py-2'>
								<button
									type='button'
									disabled={day.isCurrentMonth === false}
									className={classNames(
										day.isSelected && 'text-white',
										!day.isSelected && day.isToday && 'border border-gray-900',
										!day.isSelected && !day.isToday && day.isCurrentMonth && 'text-gray-900',
										!day.isSelected && !day.isToday && !day.isCurrentMonth && 'text-gray-400',
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
				<section className='pt-3 flex flex-col h-full'>
					<h2 className='text-lg font-medium text-gray-900 text-center'>選擇時段</h2>
					<div className='border-b border-[#D7D7D7] mt-5'></div>
					<div className={`grid gap-3 my-4 ${times.length <= 12 ? 'grid-cols-3' : 'grid-cols-4'}`}>
						{times.map((time, index) => (
							<div
								key={index}
								className={classNames(
									selectedTime === time && 'text-white bg-gray-900 hover:bg-gray-900',
									disabledTimes.includes(time) && 'pointer-events-none text-[#ACACAC] bg-[#EDEDED]',
									'group flex justify-center border cursor-pointer border-gray-200 items-center gap-x-4 rounded-xl px-2 py-1 h-11',
								)}
								onClick={() => handleSelectedTime(time)}
							>
								<p className='text-sm font-medium select-none'>{time}</p>
							</div>
						))}
					</div>
				</section>
			</div>

			<div className='w-[100%] h-[80px] py-[17px] px-[20px] bg-white absolute left-0 bottom-0 flex justify-between gap-x-2 mt-auto pt-4 shadow-[0px_2px_16px_0px_rgba(0,0,0,0.06),0px_1px_4px_0px_rgba(0,0,0,0.18)]'>
				<div>
					{selectedDay.date && selectedTime && (
						<>
							<div>已選擇</div>
							<div>{formattedDate}</div>
						</>
					)}
				</div>
				<Button disabled={!selectedDay.date || !selectedTime} onClick={handleSubmit} className='w-[120px] h-[48px]'>
					確認
				</Button>
			</div>
		</div>
	);
}
