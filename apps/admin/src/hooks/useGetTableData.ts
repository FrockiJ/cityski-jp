import { useEffect } from 'react';
import {
	FilterContext,
	ListResultI,
	OrderByType,
	ResponseWrapper,
	ResWithPaginationDTO,
	SelectOption,
} from '@repo/shared';

import useFetch from '@/hooks/useFetch';
import { setNewTableInfo } from '@/state/slices/tableSlice';
import { RootState, useAppDispatch, useAppSelector } from '@/state/store';

let refresh = 0;

function extractValuesFromDynamicObjects(data: FilterContext) {
	const result: { [key: string]: string | number | string[] } = {};

	for (const key in data) {
		if (Array.isArray(data[key])) {
			result[key] = (data[key] as SelectOption[]).map((item: { value: any }) => item.value);
		} else if (typeof data[key] === 'object') {
			result[key] = (data[key] as SelectOption).value;
		} else {
			result[key] = String(data[key]);
		}
	}

	return result;
}

interface useGetTableDataProps {
	queryUrl: string;
	tableId: string;
	conditions?: any;
	sort?: { type: string; order: OrderByType };
	options?: {
		noFetch?: boolean;
	};
}

export default function useGetTableData<T extends ListResultI>({
	queryUrl,
	tableId,
	conditions,
	sort,
	options = {
		noFetch: false,
	},
}: useGetTableDataProps) {
	const dispatch = useAppDispatch();
	const tablePageManager = useAppSelector((state) => state.table.tablePageManager);
	const filteredData = useAppSelector((state: RootState) => state.searchFilter.filterManager[tableId]);

	const conditionQuery = { ...extractValuesFromDynamicObjects(filteredData), ...conditions };
	const listOfQueryValues = Object.keys(conditionQuery).map((key: keyof typeof conditionQuery) => conditionQuery[key]);
	const querySort = sort?.type && sort?.order ? `&sort=${sort.type}&order=${sort.order}` : '';

	// re-dispatch to reset pagination for new tables via new table id
	useEffect(() => {
		if (tableId) {
			dispatch(
				setNewTableInfo({
					[`table${tableId}`]: {
						currentPage: 0,
						currentPerPage: 10,
					},
				}),
			);
		}
	}, [dispatch, tableId]);

	// re-dispatch and reset page numbers when filter changes include keyword
	useEffect(() => {
		if (tableId && conditions?.hasOwnProperty('keyword') && conditions?.keyword.length > 0) {
			dispatch(
				setNewTableInfo({
					[`table${tableId}`]: {
						currentPage: 0,
						// maintain previous currentPerPage
						currentPerPage: tablePageManager[`table${tableId}`]?.currentPerPage ?? 10,
					},
				}),
			);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [tableId, conditions?.keyword, listOfQueryValues.length]);

	// format query for pagination
	if (tablePageManager?.[`table${tableId}`]?.currentPerPage) {
		queryUrl += queryUrl.includes('?') ? '&' : '?';
		queryUrl += `limit=${tablePageManager[`table${tableId}`].currentPerPage}`;

		if (tablePageManager?.[`table${tableId}`]?.currentPage >= 0) {
			// Convert from 0-based to 1-based pagination for API
			const pageForAPI = tablePageManager[`table${tableId}`].currentPage + 1;
			queryUrl += `&page=${pageForAPI}`;
		}
	}

	// Use a forEach loop to filter candidates based on query parameters.
	let filterStr = '';

	conditionQuery &&
		Object.keys(conditionQuery).forEach((key) => {
			const value = conditionQuery[key];

			if (value !== '') {
				filterStr += `&${key}=${value}`;
			}
		});

	if (filterStr !== '') {
		!queryUrl.includes('?') && (queryUrl += '?');
		queryUrl += `${filterStr}`;
	}
	if (querySort !== '') {
		!queryUrl.includes('?') && (queryUrl += '?');
		queryUrl += `${querySort}`;
	}

	const hasParameter = tablePageManager?.[`table${tableId}`]?.currentPerPage;

	const { data, loading, mutate } = useFetch<ResponseWrapper<ResWithPaginationDTO<T[]>>>(queryUrl, {
		...options,
		noFetch: !hasParameter || options.noFetch,
	});

	const handleRefresh = () => {
		refresh += 1;
		mutate(refresh);
	};

	return {
		tableData: data?.result?.data,
		tableDataCount: data?.result?.total,
		tableDataLoading: loading,
		handleRefresh,
	};
}
