import { useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import { Dayjs } from 'dayjs';
import dayjs from 'dayjs';

import { ReservationSlot } from '@/utils/http/api/reservation-slots';

import { Event } from './Event';

interface DayViewProps {
	currentDate: Dayjs;
	slots?: ReservationSlot[];
	onSlotClick?: (slot: ReservationSlot) => void;
}

// 計算同一時間的課程，用於均分寬度
const calculateSlotPositions = (slots: ReservationSlot[], targetDate?: Dayjs) => {
	const positions = new Map<string, { overlappingCount: number; position: number }>();

	// 如果指定了日期，只計算該日期的課程
	let slotsToProcess = slots;
	if (targetDate) {
		slotsToProcess = slots.filter((slot) => dayjs(slot.startTime).isSame(targetDate, 'day'));
	}

	// 按開始時間分組
	const timeGroups = new Map<string, ReservationSlot[]>();
	slotsToProcess.forEach((slot) => {
		const timeKey = new Date(slot.startTime).toISOString();
		if (!timeGroups.has(timeKey)) {
			timeGroups.set(timeKey, []);
		}
		timeGroups.get(timeKey)!.push(slot);
	});

	// 為每個時間組的課程分配位置
	timeGroups.forEach((slotsInTime) => {
		const overlappingCount = slotsInTime.length;
		slotsInTime.forEach((slot, index) => {
			positions.set(slot.id, {
				overlappingCount,
				position: index,
			});
		});
	});

	return positions;
};

export default function DayView({ currentDate, slots = [], onSlotClick }: DayViewProps) {
	const formattedDate = `${currentDate.month() + 1}/${currentDate.date()}`;
	const dayName = `(${['日', '一', '二', '三', '四', '五', '六'][currentDate.day()]})`;

	// 計算課程位置
	const positionsMap = useMemo(() => calculateSlotPositions(slots, currentDate), [slots, currentDate]);

	return (
		<>
			{/* Time Labels Column */}
			<Box sx={{ display: 'flex', flex: 1 }}>
				<Box sx={{ width: 52, flexShrink: 0 }}>
					<Box sx={{ height: 41 }} /> {/* Empty header space */}
					{Array.from({ length: 14 }).map((_, index) => {
						const hour = index + 10;
						const time = dayjs().hour(hour).minute(0);
						return (
							<Box
								key={hour}
								sx={{
									height: 56,
									position: 'relative',
									textAlign: 'right',
									pr: 2,
									borderTop: index === 0 ? 0 : 1,
									borderColor: 'divider',
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
								<Typography
									variant='caption'
									sx={{
										position: 'absolute',
										top: 3,
										right: 9,
										color: 'text.secondary',
									}}
								>
									{time.format('hA')}
								</Typography>
							</Box>
						);
					})}
				</Box>

				{/* Day Column */}
				<Box
					sx={{
						flex: 1,
						borderLeft: 1,
						borderColor: 'divider',
						position: 'relative',
					}}
				>
					{/* Day Header */}
					<Box
						sx={{
							p: 1,
							textAlign: 'center',
							backgroundColor: 'background.paper',
							position: 'sticky',
							top: 0,
							zIndex: 1,
							borderLeft: 'none',
							borderBottom: 1,
							borderColor: 'divider',
							marginLeft: '-54px',
							width: 'calc(100% + 54px)',
						}}
					>
						<Typography color='text.secondary' fontSize={14} fontWeight={600}>
							{formattedDate} {dayName}
						</Typography>
					</Box>

					{/* Time Slots */}
					<Box sx={{ position: 'relative' }}>
						{Array.from({ length: 14 }).map((_, index) => {
							const hour = index + 10;
							const isToday = currentDate.isSame(dayjs(), 'day');
							const isCurrentHour = isToday && dayjs().hour() === hour;

							return (
								<Box
									key={hour}
									sx={{
										height: 56,
										borderTop: index === 0 ? 0 : 1,
										borderColor: 'divider',
										position: 'relative',
										backgroundColor: isCurrentHour ? 'rgba(145, 158, 171, 0.16)' : 'transparent',
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
							.filter((slot) => dayjs(slot.startTime).isSame(currentDate, 'day'))
							.map((slot) => {
								const slotDate = dayjs(slot.startTime);
								const startTime = slotDate.format('HH:mm');
								const endTime = dayjs(slot.endTime).format('HH:mm');
								const overlapInfo = positionsMap.get(slot.id) || {
									overlappingCount: 1,
									position: 0,
								};

							return (
								<Event
									key={slot.id}
									courseType={slot.courseType as any}
									type='D'
									title={slot.courseName}
									startTime={startTime}
									endTime={endTime}
									ordererName={slot.ordererName}
									transactionStatus={slot.transactionStatus}
									currentBookedCount={slot.currentBookedCount}
									maxCapacity={slot.maxCapacity}
									isMixed={slot.isMixed}
									overlappingEvents={overlapInfo.overlappingCount}
									eventPosition={overlapInfo.position}
									date={slotDate}
									currentDate={currentDate}
									onClick={() => onSlotClick?.(slot)}
								/>
							);
						})}
					</Box>
				</Box>
			</Box>
		</>
	);
}
