import { useEffect } from 'react';
import { TableType } from '@repo/shared';

import useFetch from '@/hooks/useFetch';
import { TableData } from '@/shared/types/apiModels';
import { setTablePagination } from '@/state/slices/tableSlice';
import { useAppDispatch, useAppSelector } from '@/state/store';

export default function useGetTableDataHook({ type }: { type: TableType }) {
	const dispatch = useAppDispatch();
	const tableDataPerPage = useAppSelector((state) => state.table.tableDataPerPage);
	const tablePageManager2 = useAppSelector((state) => state.table.tablePageManager2);

	let queryUrl = `api/tableData?limit=${tableDataPerPage}`;

	if (tablePageManager2[type] >= 1) {
		queryUrl += `&page=${tablePageManager2[type]}`;
	}
	const { data, loading } = useFetch<TableData>(queryUrl);

	useEffect(() => {
		if (!data) return;

		dispatch(
			setTablePagination({
				current_page: tablePageManager2[type],
				current_page_value_from: tableDataPerPage * (tablePageManager2[type] - 1) + 1,
				current_page_value_to:
					Math.ceil(data.count / tableDataPerPage) === tablePageManager2[type]
						? data.count
						: tableDataPerPage * tablePageManager2[type],
				num_values: data.count,
				total_pages: Math.ceil(data.count / tableDataPerPage),
			}),
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data, dispatch]);

	return {
		tableData: data?.result,
		tableDataCount: data?.count,
		tableDataLoading: loading,
	};
}
