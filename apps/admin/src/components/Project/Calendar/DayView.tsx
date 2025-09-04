import { Box, Typography } from '@mui/material';
import { Dayjs } from 'dayjs';
import dayjs from 'dayjs';

import { CourseType } from '@/shared/core/constants/enum';

import { Event } from './Event';

interface DayViewProps {
	currentDate: Dayjs;
}

export default function DayView({ currentDate }: DayViewProps) {
	const formattedDate = `${currentDate.month() + 1}/${currentDate.date()}`;
	const dayName = `(${['日', '一', '二', '三', '四', '五', '六'][currentDate.day()]})`;

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

						{/* Example Events */}
						<Event
							courseType={CourseType.GROUP}
							type='D'
							title='Flight to Paris'
							startTime='13:30'
							endTime='14:00'
							backgroundColor='primary.light'
							color='primary.dark'
							date={dayjs('2025-01-06')}
							currentDate={currentDate}
						/>
						<Event
							courseType={CourseType.GROUP}
							type='D'
							title='Meeting 1'
							startTime='15:00'
							endTime='16:30'
							backgroundColor='#d3d'
							color='primary.dark'
							date={dayjs('2025-01-06')}
							currentDate={currentDate}
							overlappingEvents={2}
							eventPosition={0}
						/>
						<Event
							courseType={CourseType.PRIVATE}
							type='D'
							title='Meeting 2'
							startTime='15:00'
							endTime='16:30'
							backgroundColor='#ef6'
							color='primary.dark'
							date={dayjs('2025-01-06')}
							currentDate={currentDate}
							overlappingEvents={2}
							eventPosition={1}
							paymentSettled={false}
						/>
					</Box>
				</Box>
			</Box>
		</>
	);
}
