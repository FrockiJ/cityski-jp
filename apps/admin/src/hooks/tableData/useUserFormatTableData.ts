import { useEffect, useState } from 'react';
import {
	GetUsersRequestDTO,
	GetUsersResponseDTO,
	OrderByType,
	SortType,
	UserStatus,
	UserTableListResult,
} from '@repo/shared';
import dayjs from 'dayjs';
import { configUserTable } from 'src/tableConfigs/permissions-personnel';

import useGetTableData from '@/hooks/useGetTableData';
import { useAppSelector } from '@/state/store';

type Props = {
	query?: GetUsersRequestDTO;
	sort?: SortType;
};

export const useUserFormatTableData = (options?: Props) => {
	const tableSort = useAppSelector((state) => state.table.tableSort);

	const { tableData, tableDataCount, tableDataLoading, handleRefresh } = useGetTableData<GetUsersResponseDTO>({
		queryUrl: '/api/users',
		tableId: configUserTable.tableId,
		conditions: options?.query,
		sort: { type: tableSort.orderBy, order: tableSort.order ?? OrderByType.desc },
	});

	const [formatTableData, setFormatTableData] = useState<UserTableListResult[]>([]);

	useEffect(() => {
		if (tableData) {
			const data = tableData.map((data) => {
				const tableRowData = {
					id: data.id,
					name: data.name,
					email: data.email,
					roles: data.userRolesDepartments.map((x) => `${x.department.name} - ${x.role.name}`).join(', '),
					status: data.status === UserStatus.ACTIVE,
					updatedTime: dayjs(data.updatedTime).format('YYYY/MM/DD HH:mm'),
					isSuperAdmin: data.isSuperAdmin,
					disabled: data.isSuperAdmin,
					userRolesDepartments: data.userRolesDepartments,
				};
				return tableRowData;
			});

			setFormatTableData(data);
		}
	}, [tableData]);

	return { formatTableData, tableData, tableDataCount, tableDataLoading, handleRefresh };
};
