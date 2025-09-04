import { useEffect, useState } from 'react';
import {
	GetRolesRequestDTO,
	GetRolesResponseDTO,
	IsSuperAdmin,
	OrderByType,
	RoleStatus,
	RoleTableListResult,
	SortType,
} from '@repo/shared';
import dayjs from 'dayjs';
import { configRoleTable } from 'src/tableConfigs/permissions-personnel';

import useGetTableData from '@/hooks/useGetTableData';
import { useAppSelector } from '@/state/store';

type Props = {
	query?: GetRolesRequestDTO;
	sort?: SortType;
};

export const useRoleFormatTableData = (options?: Props) => {
	const tableSort = useAppSelector((state) => state.table.tableSort);

	const { tableData, tableDataCount, tableDataLoading, handleRefresh } = useGetTableData<GetRolesResponseDTO>({
		queryUrl: '/api/roles',
		tableId: configRoleTable.tableId,
		conditions: options?.query,
		sort: { type: tableSort.orderBy, order: tableSort.order ?? OrderByType.desc },
	});

	const [formatTableData, setFormatTableData] = useState<RoleTableListResult[]>([]);

	useEffect(() => {
		if (tableData) {
			const data = tableData.map((data) => {
				const tableRowData = {
					id: data.id,
					name: data.name,
					superAdm: data.superAdm === IsSuperAdmin.YES,
					status: data.status === RoleStatus.ACTIVE,
					usageCount: data.usageCount,
					disabled: data.superAdm === IsSuperAdmin.YES,
					updatedTime: dayjs(data.updatedTime).format('YYYY/MM/DD HH:mm'),
				};
				return tableRowData;
			});

			setFormatTableData(data);
		}
	}, [tableData]);

	return { formatTableData, tableData, tableDataCount, tableDataLoading, handleRefresh };
};
