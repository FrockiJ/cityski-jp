import { useEffect, useState } from 'react';
import { CmsTableListResult, GetContentManagementResponseDTO, OrderByType } from '@repo/shared';
import dayjs from 'dayjs';
import { configCmsTable } from 'src/tableConfigs/content-management';

import { useAppSelector } from '@/state/store';

import useGetTableData from '../useGetTableData';

export const useCmsFormatTableData = () => {
	const tableSort = useAppSelector((state) => state.table.tableSort);

	const { tableData, tableDataCount, tableDataLoading, handleRefresh } =
		useGetTableData<GetContentManagementResponseDTO>({
			queryUrl: '/api/content-management',
			tableId: configCmsTable.tableId,
			sort: { type: tableSort.orderBy, order: tableSort.order ?? OrderByType.desc },
		});

	const [formatTableData, setFormatTableData] = useState<CmsTableListResult[]>([]);

	useEffect(() => {
		if (tableData) {
			const data = tableData.map((data) => {
				const tableRowData = {
					id: data.id,
					homeAreaTitle: data.homeAreaTitle,
					homeAreaType: data.homeAreaType,
					updatedTime: dayjs(data.updatedTime).format('YYYY/MM/DD'),
					updatedUser: data.updatedUser,
				};
				return tableRowData;
			});

			setFormatTableData(data);
		}
	}, [tableData]);

	return { formatTableData, tableData, tableDataCount, tableDataLoading, handleRefresh };
};
