import { useRef, useState } from 'react';
import { ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon } from '@mui/icons-material';
import { Box, Button, IconButton, Paper, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';

import DayView from './DayView';
import IndoorOverseasToggle from './IndoorOverseasToggle';
import WeekDayViewToggle from './WeekDayViewToggle';
import WeekView from './WeekView';

type ViewType = 'week' | 'day';

export default function Calendar() {
	const container = useRef<HTMLDivElement>(null);
	const containerNav = useRef<HTMLDivElement>(null);
	const [viewType, setViewType] = useState<ViewType>('week');
	const [indoorOverseas, setIndoorOverseas] = useState<'indoor' | 'overseas'>('indoor');
	const [currentDate, setCurrentDate] = useState(dayjs());

	// Format date based on view type
	const getFormattedDate = () => {
		if (viewType === 'day') {
			return currentDate.format('YYYY年MM月DD日');
		}
		// For week view, check if the week spans two months
		const weekStart = currentDate.startOf('week');
		const weekEnd = currentDate.endOf('week');

		if (weekStart.month() !== weekEnd.month()) {
			// If week spans two months, show both
			return `${weekStart.format('YYYY年MM月')} - ${weekEnd.format('MM月')}`;
		}
		return currentDate.format('YYYY年MM月');
	};

	// Handle navigation
	const handleNavigate = (direction: 'prev' | 'next') => {
		if (viewType === 'week') {
			setCurrentDate((prev) => (direction === 'prev' ? prev.subtract(1, 'week') : prev.add(1, 'week')));
		} else {
			// Day view navigation
			setCurrentDate((prev) => (direction === 'prev' ? prev.subtract(1, 'day') : prev.add(1, 'day')));
		}
	};

	// Handle "Today" button click
	const handleTodayClick = () => {
		const today = dayjs();
		if (viewType === 'week') {
			// If we're in week view, set to the week containing today
			setCurrentDate(today.startOf('week'));
		} else {
			// If we're in day view, set to today
			setCurrentDate(today);
		}
	};

	// Update menu items to handle view change
	const handleViewChange = (newView: ViewType) => {
		setViewType(newView);
	};

	const handleIndoorOverseasChange = (newView: 'indoor' | 'overseas') => {
		setIndoorOverseas(newView);
	};

	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				height: '100%',
				width: '100%',
				minWidth: '1080px',
				// maxWidth: '1220px',
				overflow: 'hidden',
				borderRadius: '16px',
				border: '1px solid rgba(145, 158, 171, 0.12)',
				backgroundColor: '#FFF',
				boxShadow: '0px 0px 2px 0px rgba(145, 158, 171, 0.20), 0px 12px 24px -4px rgba(145, 158, 171, 0.12)',
				'& .MuiDivider-root': {
					borderColor: 'rgba(145, 158, 171, 0.24)',
				},
				'& .MuiTypography-root': {
					color: '#212B36',
				},
				'& .MuiButton-root:hover': {
					backgroundColor: 'rgba(145, 158, 171, 0.08)',
				},
			}}
		>
			{/* Fixed Calendar Header */}
			<Paper
				ref={containerNav}
				elevation={1}
				sx={{
					px: 3,
					py: 2,
					flexShrink: 0,
					position: 'sticky',
					top: 0,
					zIndex: 30,
					backgroundColor: 'background.paper',
				}}
			>
				<Stack direction='row' alignItems='center' justifyContent='center' position='relative'>
					<Stack direction='row' position='absolute' left={0} gap='16px'>
						<WeekDayViewToggle viewType={viewType} onViewChange={handleViewChange} />
						<Button variant='outlined' onClick={handleTodayClick}>
							今天
						</Button>
					</Stack>
					{/* View selector */}

					<Stack direction='row' spacing={2} alignItems='center'>
						{/* Navigation */}
						<Stack direction='row' sx={{ display: 'flex', alignItems: 'center' }}>
							<IconButton size='small' onClick={() => handleNavigate('prev')}>
								<ChevronLeftIcon />
							</IconButton>
							<Typography variant='h6' px={1} width={180} textAlign='center'>
								<time dateTime={currentDate.format('YYYY-MM')}>{getFormattedDate()}</time>
							</Typography>
							<IconButton size='small' onClick={() => handleNavigate('next')}>
								<ChevronRightIcon />
							</IconButton>
						</Stack>
					</Stack>
					<Stack direction='row' position='absolute' right={0}>
						<IndoorOverseasToggle viewType={indoorOverseas} onViewChange={handleIndoorOverseasChange} />
					</Stack>
				</Stack>
			</Paper>

			{/* Scrollable Content */}
			<Box
				ref={container}
				sx={{
					flex: 1,
					overflow: 'auto',
					minHeight: 0,
					maxHeight: '712px',
				}}
			>
				{viewType === 'week' ? <WeekView currentDate={currentDate} /> : <DayView currentDate={currentDate} />}
			</Box>
		</Box>
	);
}
