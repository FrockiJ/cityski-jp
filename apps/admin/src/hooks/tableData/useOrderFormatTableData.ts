import { useEffect, useState } from 'react';
import { GetOrdersRequestDTO, GetOrdersResponseDTO, OrderByType, OrderStatus, SortType } from '@repo/shared';
import dayjs from 'dayjs';

import useGetTableData from '@/hooks/useGetTableData';
import { useAppSelector } from '@/state/store';
import { configOrdersTable } from 'src/tableConfigs/orders';

type Props = {
	query?: GetOrdersRequestDTO;
	sort?: SortType;
};

export const useOrderFormatTableData = (options?: Props) => {
	const tableSort = useAppSelector((state) => state.table.tableSort);

	const { tableData, tableDataCount, tableDataLoading, handleRefresh } = useGetTableData<GetOrdersResponseDTO>({
		queryUrl: '/api/orders',
		tableId: configOrdersTable.tableId,
		conditions: options?.query,
		sort: { type: tableSort.orderBy, order: tableSort.order ?? OrderByType.desc },
		options: { noFetch: !options?.query?.departmentId },
	});

	const [formatTableData, setFormatTableData] = useState<any[]>([]);

	const formatDate = (date: Date | null) => {
		if (!date || !dayjs(date).isValid()) return '--';
		return dayjs(date).format('YYYY/MM/DD');
	};
	useEffect(() => {
		if (tableData) {
			const data = tableData.map((data) => {
				const tableRowData = {
					id: data.id,
					no: data.no,
					name: data.courseName,
					amount: data.price,
					status: {
						[OrderStatus.PENDING_DEPOSIT]: '待付訂金',
						[OrderStatus.WAITING_FOR_CONFIRMATION]: '等待確認',
						[OrderStatus.ORDER_SUCCESSFUL]: '訂購成功',
						[OrderStatus.ORDER_COMPLETED]: '訂單完成',
						[OrderStatus.ORDER_CANCELED]: '訂單取消',
					}[data.status],
					payStatus: {
						[OrderStatus.PENDING_DEPOSIT]: '待付訂金',
						[OrderStatus.WAITING_FOR_CONFIRMATION]: '等待確認',
						[OrderStatus.ORDER_SUCCESSFUL]: '訂購成功',
						[OrderStatus.ORDER_COMPLETED]: '訂單完成',
						[OrderStatus.ORDER_CANCELED]: '訂單取消',
					}[data.status],
					lessons: data.number,
					people: data.people,
					progress: `${data.process}/${data.number}`,
					orderTime: formatDate(data.createdTime),
					
				};
				return tableRowData;
			});
			console.log('data: ', data);

			setFormatTableData(data);
		}
	}, [tableData]);

	return {
		formatTableData,
		tableData,
		tableDataCount,
		tableDataLoading,
		handleRefresh,
	};
};
