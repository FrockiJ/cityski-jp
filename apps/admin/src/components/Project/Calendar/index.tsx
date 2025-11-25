import { useEffect, useRef, useState } from 'react';
import { ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon } from '@mui/icons-material';
import { Alert, Box, Button, CircularProgress, IconButton, Paper, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';

import { CourseType } from '@repo/shared';
import { useReservationSlots } from '@/hooks/useReservationSlots';

import DayView from './DayView';
import IndoorOverseasToggle from './IndoorOverseasToggle';
import ListView from './ListView';
import ReservationFilters from './ReservationFilters';
import ViewModeToggle from './ViewModeToggle';
import WeekDayViewToggle from './WeekDayViewToggle';
import WeekView from './WeekView';

type ViewType = 'week' | 'day';
type ViewMode = 'calendar' | 'list';

interface FilterState {
	branchId: string;
	startDate: dayjs.Dayjs;
	endDate: dayjs.Dayjs;
	courseType?: CourseType;
	instructorId?: string;
}

export default function Calendar() {
	const container = useRef<HTMLDivElement>(null);
	const containerNav = useRef<HTMLDivElement>(null);
	const [viewType, setViewType] = useState<ViewType>('week');
	const [viewMode, setViewMode] = useState<ViewMode>('calendar');
	const [indoorOverseas, setIndoorOverseas] = useState<'indoor' | 'overseas'>('indoor');
	const [currentDate, setCurrentDate] = useState(dayjs());

	// 預約篩選狀態
	const [filters, setFilters] = useState<FilterState>({
		branchId: '1', // 預設分店 ID - 應該從用戶權限取得
		startDate: dayjs().startOf('week'),
		endDate: dayjs().endOf('week'),
	});

	// 模擬部門和教練資料 - 應該從 API 取得
	const departments = [
		{ id: '1', name: '台北分店' },
		{ id: '2', name: '台中分店' },
		{ id: '3', name: '高雄分店' },
	];

	const instructors = [
		{ id: '1', name: '王教練' },
		{ id: '2', name: '李教練' },
		{ id: '3', name: '張教練' },
	];

	// 使用預約時段 hook
	const slotsParams = {
		branch_id: filters.branchId,
		start_date: filters.startDate.format('YYYY-MM-DD'),
		end_date: filters.endDate.format('YYYY-MM-DD'),
		...(filters.courseType && { course_type: filters.courseType }),
		...(filters.instructorId && { instructor_id: filters.instructorId }),
	};

	const { slots, loading, error, refetch } = useReservationSlots(slotsParams);

	// 當檢視類型改變時，更新日期範圍
	useEffect(() => {
		if (viewType === 'week') {
			setFilters((prev) => ({
				...prev,
				startDate: currentDate.startOf('week'),
				endDate: currentDate.endOf('week'),
			}));
		} else {
			setFilters((prev) => ({
				...prev,
				startDate: currentDate.startOf('day'),
				endDate: currentDate.endOf('day'),
			}));
		}
	}, [viewType, currentDate]);

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

	const handleSlotClick = (slot: any) => {
		console.log('Slot clicked:', slot);
		// TODO: 開啟預約詳情彈窗
	};

	const handleFiltersChange = (newFilters: FilterState) => {
		setFilters(newFilters);
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
			{/* 預約篩選器 */}
			<ReservationFilters
				filters={filters}
				departments={departments}
				instructors={instructors}
				onFiltersChange={handleFiltersChange}
			/>

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
				<Stack direction='row' alignItems='center' justifyContent='center' position='relative' sx={{ height: 40 }}>
					<Stack direction='row' position='absolute' left={0} gap='16px'>
						<ViewModeToggle viewMode={viewMode} onViewModeChange={setViewMode} />
						{viewMode === 'calendar' && <WeekDayViewToggle viewType={viewType} onViewChange={handleViewChange} />}
						<Button variant='outlined' onClick={handleTodayClick}>
							今天
						</Button>
					</Stack>

					<Stack direction='row' spacing={2} alignItems='center'>
						{/* Navigation - 只在行事曆模式顯示 */}
						{viewMode === 'calendar' && (
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
						)}
					</Stack>

					<Stack direction='row' position='absolute' right={0}>
						<IndoorOverseasToggle viewType={indoorOverseas} onViewChange={handleIndoorOverseasChange} />
					</Stack>
				</Stack>
			</Paper>

			{/* 錯誤提示 */}
			{error && (
				<Box sx={{ p: 2 }}>
					<Alert
						severity='error'
						action={
							<Button size='small' onClick={refetch}>
								重新載入
							</Button>
						}
					>
						{error}
					</Alert>
				</Box>
			)}

			{/* Loading 狀態 */}
			{loading && (
				<Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
					<CircularProgress />
				</Box>
			)}

			{/* 內容區域 */}
			{!loading && (
				<Box
					ref={container}
					sx={{
						flex: 1,
						overflow: 'auto',
						minHeight: 0,
						maxHeight: viewMode === 'list' ? 'none' : '712px',
					}}
				>
					{viewMode === 'list' ? (
						<ListView
							slots={slots.map((slot) => ({
								...slot,
								courseType: slot.courseType as unknown as CourseType,
							}))}
							onSlotClick={handleSlotClick}
						/>
					) : viewType === 'week' ? (
						<WeekView currentDate={currentDate} slots={slots} onSlotClick={handleSlotClick} />
					) : (
						<DayView currentDate={currentDate} slots={slots} onSlotClick={handleSlotClick} />
					)}
				</Box>
			)}
		</Box>
	);
}
