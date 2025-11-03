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

	const { tableData, tableDataCount, tableDataLoading, handleRefresh } = useGetTableData<ReservationResponseDto>({
		queryUrl: '/api/reservations',
		tableId: isOverseas ? configReservationsOverseasTable.tableId : configReservationsIndoorTable.tableId,
		conditions: options?.query,
		sort: { type: tableSort.orderBy, order: tableSort.order ?? OrderByType.desc },
	});

	const [formatTableData, setFormatTableData] = useState<
		(ReservationIndoorTableListResult | ReservationOverseasTableListResult)[]
	>([]);

	useEffect(() => {
		if (tableData) {
			const data = tableData.map((reservation) => {
				// 基本資料結構
				const baseData = {
					id: reservation.id,
					no: reservation.reservationNo.toString(),
					name: `預約 #${reservation.reservationNo}`,
					status: getStatusText(reservation.reservationStatus),
					boardType: getTeachingLevelText(reservation.teachingLevel),
					level: `LV.${getTeachingLevelText(reservation.teachingLevel)}`,
					instructor: reservation.instructor || '未指定',
					beginTime: dayjs(reservation.classTime).format('YYYY/MM/DD HH:mm'),
          
				};

				if (isOverseas) {
					// 海外課程的資料結構
					const overseasData: ReservationOverseasTableListResult = {
						...baseData,
						snowField: reservation.department?.name || '未知雪場',
						remaining: Math.floor(Math.random() * 10), // 暫時用隨機數，實際應該從API獲取
					};
					return overseasData;
				} else {
					// 室內課程的資料結構
					const indoorData: ReservationIndoorTableListResult = {
						...baseData,
						number: reservation?.reservationMembers?.length || 0,
						remaining:  (reservation?.reservationMembers?.[0]?.orderMember?.order?.coursePlan?.course?.coursePeople?.[0]?.maxPeople || 0) - (reservation?.reservationMembers?.length || 0)
					};
					return indoorData;
				}
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