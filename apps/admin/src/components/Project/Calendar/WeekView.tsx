import React from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import dayjs from 'dayjs';

import { TEXT_PRIMARY } from '@/shared/constants/colors';
import { CourseType } from '@/shared/core/constants/enum';

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
};

const WeekView = ({ currentDate }: Props) => {
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

								<Event
									courseType={CourseType.GROUP}
									type='W'
									title='Flight to Paris'
									startTime='13:30'
									endTime='14:00'
									backgroundColor='primary.light'
									color='primary.dark'
									overlappingEvents={2}
									eventPosition={0}
									date={dayjs('2025-01-05')}
									currentDate={date}
								/>
								<Event
									courseType={CourseType.PRIVATE}
									type='W'
									title='Flight to Paris2'
									startTime='13:30'
									endTime='14:00'
									backgroundColor='#d3d'
									color='primary.dark'
									overlappingEvents={2}
									eventPosition={1}
									date={dayjs('2025-01-05')}
									currentDate={date}
								/>
								<Event
									courseType={CourseType.GROUP}
									type='W'
									title='Flight to Paris3'
									startTime='13:00'
									endTime='13:30'
									backgroundColor='#E43'
									color='primary.dark'
									date={dayjs('2025-01-05')}
									currentDate={date}
									paymentSettled={false}
								/>
								<Event
									courseType={CourseType.TRAINING}
									type='W'
									title='Flight to Japan'
									startTime='10:30'
									endTime='11:00'
									backgroundColor='primary.light'
									color='primary.dark'
									date={dayjs('2025-01-08')}
									currentDate={date}
								/>
								<Event
									courseType={CourseType.GROUP}
									type='W'
									title='Flight to Australia'
									startTime='19:00'
									endTime='20:00'
									backgroundColor='primary.light'
									color='primary.dark'
									date={dayjs('2025-01-07')}
									currentDate={date}
									unPaidDownPayment
								/>
							</Box>
						</Box>
					);
				})}
			</Box>
		</Box>
	);
};

export default WeekView;
