import { useEffect, useState } from 'react';
import {
	FrontendMemberManagementTableListResult,
	GetMembersRequestDto,
	MemberResponseDto,
	MemberStatus,
	MemberType,
	OrderByType,
	SortType,
} from '@repo/shared';
import dayjs from 'dayjs';
import { configFrontendMemberManagementTable } from 'src/tableConfigs/frontend-member-management';

import useGetTableData from '@/hooks/useGetTableData';
import { useAppSelector } from '@/state/store';

type Props = {
	query?: GetMembersRequestDto;
	sort?: SortType;
};

export const useFrontendMemberManagementFormatTableData = (options?: Props) => {
	const tableSort = useAppSelector((state) => state.table.tableSort);

	const { tableData, tableDataCount, tableDataLoading, handleRefresh } = useGetTableData<MemberResponseDto>({
		queryUrl: '/api/member',
		tableId: configFrontendMemberManagementTable.tableId,
		conditions: options?.query,
		sort: { type: tableSort.orderBy, order: tableSort.order ?? OrderByType.desc },
	});

	const [formatTableData, setFormatTableData] = useState<FrontendMemberManagementTableListResult[]>([]);

	useEffect(() => {
		if (tableData) {
			const data = tableData.map((data) => {
				const tableRowData = {
					id: data.id,
					no: data.no,
					name: data.name,
					phone: data.phone ?? '',
					snowboard: String(data.snowboard),
					skis: String(data.skis),
					email: data.email ?? '',
					type: data.type === MemberType.E ? 'Email' : 'LINE',
					birthday: dayjs(data.birthday).format('YYYY/MM/DD'),
					status: Boolean(data.status),
					disabled: data.status === MemberStatus.NOT_YET_VERIFIED,
					createTime: dayjs(data.createdTime).format('YYYY/MM/DD'),
				};
				return tableRowData;
			});

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
