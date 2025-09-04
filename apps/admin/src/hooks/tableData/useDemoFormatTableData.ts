import { useEffect, useState } from 'react';
import { OrderByType, QueryDemoDto, SortType } from '@repo/shared';

import { DemoListResultI } from '@/shared/core/constants/interface/listResults/demoResult';
import { useAppSelector } from '@/state/store';

type PropI = {
	query?: QueryDemoDto;
	sort?: SortType;
};

export const useDemoFormatTableData = (options?: PropI) => {
	const tableSort = useAppSelector((state) => state.table.tableSort);
	const {
		query,
		sort = {
			type: tableSort.orderBy ?? 'updateDate',
			order: tableSort.order ?? OrderByType.desc,
		},
	} = options ?? {};

	console.log({ query, sort });

	const tableData: DemoListResultI[] = [
		{
			id: 'asd',
			name: 'John',
			email: 'demo@gmail.com',
			createdDate: '2024-09-03',
			status: 'Active',
			role: ['Super Admin', 'Admin'],
		},
	];
	const tableDataCount = tableData.length;
	const tableDataLoading = false;
	const handleRefresh = () => {};
	// const { tableData, tableDataCount, tableDataLoading, handleRefresh } =
	//   useGetTableData<QueryDemoDto>(
	//     "user?roles=admin",
	//     swimmerAndHostTableConfig.tableId,
	//     query,
	//     sort
	//   );

	// console.log('@filter query', query);

	const [formatTableData, setFormatTableData] = useState<DemoListResultI[]>([]);

	useEffect(() => {
		if (tableData) {
			//todo:  format data
			const formatData = tableData;
			setFormatTableData(formatData);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return { formatTableData, tableDataCount, tableDataLoading, handleRefresh };
};
