import React from 'react';
import { FitnessCenter, Group, Groups, Person, Schedule } from '@mui/icons-material';
import { Avatar, Box, Card, CardContent, Chip, Divider, Grid, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';

import { CourseType } from '@repo/shared';

import { ReservationSlot } from '@/utils/http/api/reservation-slots';

interface ListViewProps {
	slots: ReservationSlot[];
	onSlotClick?: (slot: ReservationSlot) => void;
}

const ListView: React.FC<ListViewProps> = ({ slots, onSlotClick }) => {
	const getCourseTypeIcon = (type: CourseType) => {
		switch (type) {
			case CourseType.PRIVATE:
				return <Person fontSize='small' />;
			case CourseType.GROUP:
				return <Groups fontSize='small' />;
			case CourseType.INDIVIDUAL:
				return <FitnessCenter fontSize='small' />;
			default:
				return <Schedule fontSize='small' />;
		}
	};

	const getCourseTypeText = (type: CourseType) => {
		switch (type) {
			case CourseType.PRIVATE:
				return '私人課程';
			case CourseType.GROUP:
				return '團體課程';
			case CourseType.INDIVIDUAL:
				return '個人練習';
			default:
				return '未知';
		}
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'available':
				return {
					backgroundColor: 'rgba(54, 179, 126, 0.16)',
					color: '#1B806A',
				};
			case 'full':
				return {
					backgroundColor: 'rgba(255, 86, 48, 0.16)',
					color: '#B71D18',
				};
			case 'closed':
				return {
					backgroundColor: 'rgba(145, 158, 171, 0.16)',
					color: '#637381',
				};
			default:
				return {
					backgroundColor: 'rgba(145, 158, 171, 0.16)',
					color: '#637381',
				};
		}
	};

	const getStatusText = (status: string) => {
		switch (status) {
			case 'available':
				return '可預約';
			case 'full':
				return '額滿';
			case 'closed':
				return '已關閉';
			default:
				return '未知';
		}
	};

	const getCourseTypeColor = (type: CourseType) => {
		switch (type) {
			case CourseType.PRIVATE:
				return {
					backgroundColor: 'rgba(255, 171, 0, 0.24)',
					color: '#B76E00',
					border: '1px solid rgba(255, 171, 0, 0.32)',
				};
			case CourseType.GROUP:
				return {
					backgroundColor: 'rgba(0, 184, 217, 0.24)',
					color: '#006C9C',
					border: '1px solid rgba(0, 184, 217, 0.32)',
				};
			case CourseType.INDIVIDUAL:
				return {
					backgroundColor: 'rgba(54, 179, 126, 0.24)',
					color: '#1B806A',
					border: '1px solid rgba(54, 179, 126, 0.32)',
				};
			default:
				return {
					backgroundColor: 'rgba(145, 158, 171, 0.24)',
					color: '#919EAB',
					border: '1px solid rgba(145, 158, 171, 0.32)',
				};
		}
	};

	const groupedSlots = slots.reduce(
		(acc, slot) => {
			const date = dayjs(slot.startTime).format('YYYY-MM-DD');
			if (!acc[date]) {
				acc[date] = [];
			}
			acc[date].push(slot);
			return acc;
		},
		{} as Record<string, ReservationSlot[]>,
	);

	// Sort dates
	const sortedDates = Object.keys(groupedSlots).sort();

	return (
		<Box sx={{ p: 2 }}>
			{sortedDates.length === 0 ? (
				<Card sx={{ textAlign: 'center', py: 8 }}>
					<CardContent>
						<Typography variant='h6' color='text.secondary'>
							沒有找到符合條件的預約時段
						</Typography>
					</CardContent>
				</Card>
			) : (
				sortedDates.map((date) => (
					<Box key={date} sx={{ mb: 3 }}>
						<Typography variant='h6' sx={{ mb: 2, color: 'text.primary' }}>
							{dayjs(date).format('YYYY年MM月DD日 dddd')}
						</Typography>

						<Grid container spacing={2}>
							{groupedSlots[date]
								.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
								.map((slot) => (
									<Grid item xs={12} sm={6} md={4} key={slot.id}>
										<Card
											sx={{
												cursor: onSlotClick ? 'pointer' : 'default',
												transition: 'transform 0.2s, box-shadow 0.2s',
												'&:hover': {
													...(onSlotClick && {
														transform: 'translateY(-2px)',
														boxShadow: 2,
													}),
												},
											}}
											onClick={() => onSlotClick?.(slot)}
										>
											<CardContent sx={{ pb: 2 }}>
												<Stack spacing={2}>
													{/* 時間和狀態 */}
													<Stack direction='row' justifyContent='space-between' alignItems='center'>
														<Typography variant='h6' component='div'>
															{dayjs(slot.startTime).format('HH:mm')} - {dayjs(slot.endTime).format('HH:mm')}
														</Typography>
														<Chip
															label={getStatusText(slot.status)}
															size='small'
															sx={{
																...getStatusColor(slot.status),
																fontWeight: 600,
															}}
														/>
													</Stack>

													{/* 課程資訊 */}
													<Stack spacing={1}>
														<Typography variant='subtitle1' fontWeight={600}>
															{slot.courseName}
														</Typography>

														<Stack direction='row' spacing={1} alignItems='center'>
															<Chip
																icon={getCourseTypeIcon(slot.courseType)}
																label={getCourseTypeText(slot.courseType)}
																size='small'
																sx={getCourseTypeColor(slot.courseType)}
															/>

															{slot.isMixed && (
																<Chip
																	icon={<Group fontSize='small' />}
																	label='已併班'
																	size='small'
																	color='warning'
																	variant='outlined'
																/>
															)}
														</Stack>
													</Stack>

													<Divider />

													{/* 詳細資訊 */}
													<Stack spacing={1}>
														{slot.instructorName && (
															<Stack direction='row' alignItems='center' spacing={1}>
																<Avatar sx={{ width: 20, height: 20, fontSize: 12 }}>教</Avatar>
																<Typography variant='body2' color='text.secondary'>
																	{slot.instructorName}
																</Typography>
															</Stack>
														)}

														<Stack direction='row' alignItems='center' spacing={1}>
															<Typography variant='body2' color='text.secondary'>
																場地: {slot.venueName}
															</Typography>
														</Stack>

														<Stack direction='row' justifyContent='space-between' alignItems='center'>
															<Typography variant='body2' color='text.secondary'>
																{slot.departmentName}
															</Typography>

															<Typography variant='body2' fontWeight={600}>
																{slot.currentBookedCount}/{slot.maxCapacity} 人
															</Typography>
														</Stack>
													</Stack>
												</Stack>
											</CardContent>
										</Card>
									</Grid>
								))}
						</Grid>
					</Box>
				))
			)}
		</Box>
	);
};

export default ListView;
