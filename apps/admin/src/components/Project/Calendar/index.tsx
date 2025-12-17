import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon } from '@mui/icons-material';
import { Alert, Box, Button, CircularProgress, IconButton, Paper, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';

import { CourseType, ModalType } from '@repo/shared';
import { useReservationSlots } from '@/hooks/useReservationSlots';
import { useDepartments } from '@/hooks/useDepartments';
import useModalProvider from '@/hooks/useModalProvider';
import AddEditReservationIndoorModal from '@/components/Project/ReservationManagement/AddEditReservationIndoorModal';

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
	const modal = useModalProvider();
	const [viewType, setViewType] = useState<ViewType>('week');
	const [viewMode, setViewMode] = useState<ViewMode>('calendar');
	const [indoorOverseas, setIndoorOverseas] = useState<'indoor' | 'overseas'>('indoor');
	const [currentDate, setCurrentDate] = useState(dayjs());

	// 預約篩選狀態
	const [filters, setFilters] = useState<FilterState>({
		branchId: '', // 將從 API 取得後設定第一個分店
		startDate: dayjs().startOf('week'),
		endDate: dayjs().endOf('week'),
	});

	// 使用部門資料 hook
	const { departments, loading: departmentsLoading } = useDepartments();

	// 當部門資料載入完成後，設定第一個分店為預設值
	useEffect(() => {
		if (!filters.branchId && departments.length > 0) {
			setFilters((prev) => ({
				...prev,
				branchId: departments[0].id,
			}));
		}
	}, [departments, filters.branchId]);

	// 使用預約時段 hook
	const slotsParams = {
		branch_id: filters.branchId,
		start_date: filters.startDate.format('YYYY-MM-DD'),
		end_date: filters.endDate.format('YYYY-MM-DD'),
		...(filters.courseType && { course_type: filters.courseType }),
	};

	const { slots, loading, error, refetch } = useReservationSlots(slotsParams);

	// 從 slots 中提取教練列表
	const [coaches, setCoaches] = useState<Array<{ id: string; name: string }>>([]);

	// 當篩選條件或 slots 改變時，重新計算 coaches
	useEffect(() => {
		if (!slots || slots.length === 0) {
			setCoaches([]);
			return;
		}

		// 從 slots 中提取所有唯一的教練
		const uniqueCoaches = new Set<string>();

		slots.forEach((slot) => {
			if ( slot.instructorName) {
				uniqueCoaches.add(slot.instructorName);
			}
		});

		setCoaches(Array.from(uniqueCoaches).map((name) => ({ id: name, name })));
	}, [slots, filters.branchId, filters.courseType, filters.startDate, filters.endDate]);



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
		modal.openModal({
			title: `編輯預約`,
			center: true,
			fullScreen: true,
			noAction: true,
			marginBottom: true,
			children: (
				<AddEditReservationIndoorModal
					modalType={ModalType.EDIT}
					courseType={''}
					courseStatusType={0}
					reservationId={slot.reservationId}
					handleRefresh={refetch}
				/>
			),
		});
	};

	const handleFiltersChange = (newFilters: FilterState) => {
		setFilters(newFilters);
		// Update currentDate when date filter changes
		if (!newFilters.startDate.isSame(filters.startDate, 'day')) {
			setCurrentDate(newFilters.startDate);
		}
	};

	// 前端過濾：根據選擇的教練過濾時段
	const filteredSlots = useMemo(() => {
		if (!filters.instructorId) {
			return slots;
		}

		return slots.filter((slot) => slot.instructorName === filters.instructorId);
	}, [slots, filters.instructorId]);

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
				instructors={coaches}
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
							slots={filteredSlots.map((slot) => ({
								...slot,
								courseType: slot.courseType as unknown as CourseType,
							}))}
							onSlotClick={handleSlotClick}
						/>
					) : viewType === 'week' ? (
						<WeekView currentDate={currentDate} slots={filteredSlots} onSlotClick={handleSlotClick} />
					) : (
						<DayView currentDate={currentDate} slots={filteredSlots} onSlotClick={handleSlotClick} />
					)}
				</Box>
			)}
		</Box>
	);
}
