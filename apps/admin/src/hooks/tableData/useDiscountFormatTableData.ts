import { useEffect, useState } from 'react';
import {
	DiscountStatus,
	DiscountTableListResult,
	DiscountType,
	GetDiscountRequestDTO,
	GetDiscountResponseDTO,
	OrderByType,
	SortType,
} from '@repo/shared';
import dayjs from 'dayjs';
import { configDiscountTable } from 'src/tableConfigs/promotion-settings';

import useGetTableData from '@/hooks/useGetTableData';
import { useAppSelector } from '@/state/store';

type Props = {
	query?: GetDiscountRequestDTO;
	sort?: SortType;
};

export const useDiscountFormatTableData = (options?: Props) => {
	const tableSort = useAppSelector((state) => state.table.tableSort);

	const { tableData, tableDataCount, tableDataLoading, handleRefresh } = useGetTableData<GetDiscountResponseDTO>({
		queryUrl: '/api/discounts',
		tableId: configDiscountTable.tableId,
		conditions: options?.query,
		sort: { type: tableSort.orderBy, order: tableSort.order ?? OrderByType.desc },
		options: { noFetch: !options?.query?.departmentId },
	});

	const [formatTableData, setFormatTableData] = useState<DiscountTableListResult[]>([]);

	useEffect(() => {
		if (tableData) {
			const data = tableData.map((data) => {
				const tableRowData = {
					id: data.id,
					status: data.status === DiscountStatus.ACTIVE,
					statusTag: {
						[DiscountStatus.ACTIVE]: '啟用中',
						[DiscountStatus.INACTIVE]: '已停用',
						[DiscountStatus.EXPIRED]: '已過期',
					}[data.status],
					type: data.type,
					discount: data.type === DiscountType.AMOUNT ? `折${data.discount}元` : `打${data.discount}折`,
					code: data.code,
					note: data.note,
					endDate: dayjs(data.endDate).format('YYYY/MM/DD'),
					createdTime: dayjs(data.createdTime).format('YYYY/MM/DD'),
					isUsed: data.isUsed,
					usageLimit: data.usageLimit === 0 ? '無' : data.usageLimit,
					disabled: data.status === DiscountStatus.EXPIRED,
				};
				return tableRowData;
			});

			setFormatTableData(data);
		}
	}, [tableData]);

	return { formatTableData, tableData, tableDataCount, tableDataLoading, handleRefresh };
};
