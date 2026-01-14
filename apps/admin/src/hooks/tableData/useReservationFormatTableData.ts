import { useEffect, useState } from 'react';
import {
	ReservationIndoorTableListResult,
	ReservationOverseasTableListResult,
	ReservationResponseDto,
	GetReservationsRequestDto,
	ReservationStatusEnum,
	OrderByType,
	SortType,
	ReservationStatus,
	SkiAndSnowboardLevelEnum,
	SkiAndSnowboardLevel,
	CourseSkiType,
} from '@repo/shared';
import dayjs from 'dayjs';
import { configReservationsIndoorTable } from 'src/tableConfigs/reservations-indoor';
import { configReservationsOverseasTable } from 'src/tableConfigs/reservations-overseas';

import useGetTableData from '@/hooks/useGetTableData';
import { useAppSelector } from '@/state/store';

type Props = {
	query?: GetReservationsRequestDto;
	sort?: SortType;
	type?: 'indoor' | 'overseas';
};

export const useReservationFormatTableData = (options?: Props) => {
	const tableSort = useAppSelector((state) => state.table.tableSort);
	const isOverseas = options?.type === 'overseas';

	// Map frontend field names to backend database column names
	const fieldMapping: Record<string, string> = {
		'no': 'reservationNo',
		'name': 'classTime',  // courseName is computed, use classTime as fallback
		'status': 'reservationStatus',
		'boardType': 'teachingLevel',  // skiType is from order table, use teachingLevel as fallback
		'level': 'teachingLevel',
		'instructor': 'instructor',
		'number': 'classTime',  // currentMembers is computed, use classTime as fallback
		'remaining': 'classTime',  // remainingSlots is computed, use classTime as fallback
		'beginTime': 'classTime',
	};

	const backendSortField = tableSort.orderBy ? (fieldMapping[tableSort.orderBy] || tableSort.orderBy) : '';
	console.log('[useReservationFormatTableData] Sort mapping:', {
		frontendField: tableSort.orderBy,
		backendField: backendSortField,
		order: tableSort.order
	});

	const { tableData, tableDataCount, tableDataLoading, handleRefresh } = useGetTableData<ReservationResponseDto>({
		queryUrl: '/api/reservations',
		tableId: isOverseas ? configReservationsOverseasTable.tableId : configReservationsIndoorTable.tableId,
		conditions: options?.query,
		sort: { type: backendSortField, order: tableSort.order ?? OrderByType.desc },
	});

	const [formatTableData, setFormatTableData] = useState<
		(ReservationIndoorTableListResult | ReservationOverseasTableListResult)[]
	>([]);

	useEffect(() => {
		if (tableData) {
			const data = tableData.map((reservation) => {
				const currentNumber = reservation?.reservationMembers?.length || 0;
				const maxNumber = reservation.maxStudentCount || 0;
				const remaining = maxNumber > 0 ? maxNumber - currentNumber : 0;

				// 基本資料結構
				const baseData = {
					id: reservation.id,
					departmentId: reservation.departmentId || '',
					no: reservation.reservationNo.toString(),
					name: reservation.courseName || `預約 #${reservation.reservationNo}`,
					status: getStatusText(reservation.reservationStatus),
					reservationStatus: reservation.reservationStatus,
					boardType: getSkiTypeText(reservation.skiType),
					level: `LV.${getTeachingLevelText(reservation.teachingLevel)}`,
					instructor: reservation.instructor || '',
					beginTime: dayjs(reservation.classTime).format('YYYY/MM/DD HH:mm'),
				};

				// if (isOverseas) {
				// 	// 海外課程的資料結構
				// 	const overseasData: ReservationOverseasTableListResult = {
				// 		...baseData,
				// 		snowField: reservation.department?.name || '未知雪場',
				// 		remaining: Math.floor(Math.random() * 10), // 暫時用隨機數，實際應該從API獲取
				// 	};
				// 	return overseasData;
				// } else {
				// 室內課程的資料結構
				const indoorData: any = {
					...baseData,
					number: currentNumber,
					remaining: remaining,
				};
				return indoorData;
				// }
			});

			setFormatTableData(data);
		}
	}, [tableData, isOverseas]);

	return { formatTableData, tableData, tableDataCount, tableDataLoading, handleRefresh };
};

// 輔助函數：獲取狀態文字
function getStatusText(status: number): string {
	switch (status) {
		case ReservationStatus.SCHEDULED:
			return '已排定';
		case ReservationStatus.PENDING_REVIEW:
			return '待紀錄';
		case ReservationStatus.COMPLETED:
			return '已完成';
		case ReservationStatus.CANCELED:
			return '已取消';
		default:
			return '未知狀態';
	}
}

// 輔助函數：獲取教學等級文字
function getTeachingLevelText(level: SkiAndSnowboardLevelEnum): string {
	return SkiAndSnowboardLevel[level] || '未知等級';
}

// 輔助函數：獲取板類文字
function getSkiTypeText(skiType?: number): string {
	if (skiType === undefined || skiType === null) return '';

	switch (skiType) {
		case CourseSkiType.BOTH:
			return '雙板/單板';
		case CourseSkiType.SNOWBOARD:
			return '單板';
		case CourseSkiType.SKI:
			return '雙板';
		default:
			return '';
	}
}
