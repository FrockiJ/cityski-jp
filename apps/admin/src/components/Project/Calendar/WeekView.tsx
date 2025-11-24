import React, { useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import dayjs from 'dayjs';

import { TEXT_PRIMARY } from '@/shared/constants/colors';
import { ReservationSlot } from '@/utils/http/api/reservation-slots';

import { Event } from './Event';

// Styled components
const TimeColumn = styled(Box)(({ theme }) => ({
	position: 'sticky',
	left: 0,
	zIndex: 10,
	width: '52px',
	flexShrink: 0,
	backgroundColor: theme.palette.background.paper,
	borderRight: `1px solid ${theme.palette.divider}`,
}));

const TimeSlot = styled(Box)(({ theme }) => ({
	position: 'sticky',
	left: 0,
	zIndex: 20,
	marginLeft: '-56px',
	width: '56px',
	paddingRight: theme.spacing(1),
	textAlign: 'right',
	color: TEXT_PRIMARY,
	fontSize: '0.75rem',
	marginTop: '0px',
}));

type Props = {
	currentDate: dayjs.Dayjs;
	slots?: ReservationSlot[];
	onSlotClick?: (slot: ReservationSlot) => void;
};

// 重疊檢測算法
const calculateOverlappingSlots = (slots: ReservationSlot[], targetDate?: dayjs.Dayjs) => {
	const overlaps = new Map<string, { overlappingCount: number; position: number }>();

	// 如果指定了日期，只計算該日期的課程
	let slotsToProcess = slots;
	if (targetDate) {
		slotsToProcess = slots.filter((slot) => dayjs(slot.startTime).isSame(targetDate, 'day'));
	}


	// 按開始時間排序
	const sorted = [...slotsToProcess].sort(
		(a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
	);

	sorted.forEach((slot, index) => {
		let overlappingCount = 1;
		let position = 0;

		sorted.forEach((otherSlot, otherIndex) => {
			if (index === otherIndex) return;

			const slotStart = new Date(slot.startTime);
			const slotEnd = new Date(slot.endTime);
			const otherStart = new Date(otherSlot.startTime);
			const otherEnd = new Date(otherSlot.endTime);

			// 檢查重疊
			if (slotStart < otherEnd && slotEnd > otherStart) {
				if (otherIndex < index) {
					position++;
				}
				overlappingCount = Math.max(
					overlappingCount,
					(overlaps.get(otherSlot.id)?.overlappingCount || 1) + 1
				);
			}
		});

		overlaps.set(slot.id, { overlappingCount, position });
	});

	return overlaps;
};

const WeekView = ({ currentDate, slots = [], onSlotClick }: Props) => {
	return (
		<Box sx={{ display: 'flex', height: '100%' }}>
			{/* Time Column */}
			<TimeColumn>
				<Box sx={{ height: 41 }} />
				{Array.from({ length: 14 }).map((_, index) => {
					const hour = index + 10;
					return (
						<Box
							key={hour}
							sx={{
								height: 56,
								borderTop: 1,
								borderColor: 'divider',
								position: 'relative',
								'&::after': {
									content: '""',
									position: 'absolute',
									left: 0,
									right: 0,
									top: '50%',
									borderBottom: '1px dashed',
									borderColor: 'divider',
									pointerEvents: 'none',
								},
							}}
						>
							<TimeSlot>{`${hour > 12 ? hour - 12 : hour}${hour >= 12 ? 'PM' : 'AM'}`}</TimeSlot>
						</Box>
					);
				})}
			</TimeColumn>

			{/* Days Grid */}
			<Box sx={{ display: 'flex', flex: 1 }}>
				{['(日)', '(一)', '(二)', '(三)', '(四)', '(五)', '(六)'].map((day, dayIndex) => {
					// Calculate the date for each day in the week
					const date = currentDate.startOf('week').add(dayIndex, 'day');
					const formattedDate = `${date.month() + 1}/${date.date()}`;
					const isToday = date.isSame(dayjs(), 'day'); // Check if this day is today
					// 為該日期計算重疊時段
					const overlappingMap = useMemo(() => calculateOverlappingSlots(slots, date), [slots, date]);

					return (
						<Box
							key={day}
							sx={{
								flex: 1,
								borderLeft: dayIndex === 0 ? 0 : 1,
								borderColor: 'divider',
								position: 'relative',
								...(isToday && {
									backgroundColor: 'rgba(145, 158, 171, 0.16)',
								}),
							}}
						>
							{/* Day Header */}
							<Box
								sx={{
									p: 1,
									// pb: '9px',
									textAlign: 'center',
									borderBottom: 1,
									borderColor: 'divider',
									backgroundColor: 'background.paper',
									position: 'sticky',
									top: 0,
									zIndex: 1,
									borderLeft: 'none',
									marginLeft: dayIndex === 0 ? 0 : -1,
									width: dayIndex === 0 ? '102%' : `calc(100% + ${dayIndex + 2}px)`,
								}}
							>
								<Typography color='text.secondary' fontSize={14} fontWeight={600}>
									{formattedDate} {day}
								</Typography>
							</Box>

							{/* Time Slots */}
							<Box sx={{ position: 'relative' }}>
								{Array.from({ length: 14 }).map((_, index) => {
									const hour = index + 10;
									return (
										<Box
											key={hour}
											sx={{
												height: 56,
												borderTop: 1,
												borderColor: 'divider',
												position: 'relative',
												'&:hover': {
													backgroundColor: 'action.hover',
												},
												'&::after': {
													content: '""',
													position: 'absolute',
													left: 0,
													right: 0,
													top: '50%',
													borderBottom: '1px dashed',
													borderColor: 'divider',
													pointerEvents: 'none',
												},
											}}
										/>
									);
								})}

								{/* 渲染課程時段 */}
								{slots
									.filter((slot) => dayjs(slot.startTime).isSame(date, 'day'))
									.map((slot) => {
										const slotDate = dayjs(slot.startTime);
										const startTime = slotDate.format('HH:mm');
										const endTime = dayjs(slot.endTime).format('HH:mm');
										const overlapInfo = overlappingMap.get(slot.id) || {
											overlappingCount: 1,
											position: 0,
										};


									return (
										<Event
											key={slot.id}
											courseType={slot.courseType as any}
											type='W'
											title={slot.courseName}
											startTime={startTime}
											endTime={endTime}
											instructor={slot.instructorName}
											status={slot.status}
											currentBookedCount={slot.currentBookedCount}
											maxCapacity={slot.maxCapacity}
											isMixed={slot.isMixed}
											overlappingEvents={overlapInfo.overlappingCount}
											eventPosition={overlapInfo.position}
											date={slotDate}
											currentDate={date}
											onClick={() => onSlotClick?.(slot)}
										/>
									);
								})}
							</Box>
						</Box>
					);
				})}
			</Box>
		</Box>
	);
};

export default WeekView;
