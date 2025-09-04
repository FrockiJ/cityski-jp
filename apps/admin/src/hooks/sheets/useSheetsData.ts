import { useEffect } from 'react';
import { TableType } from '@repo/shared';

import { SheetsColumn } from '@/shared/constants/enums';
import { getSheetsApi, SheetsData } from '@/shared/constants/sheetsApi';
import { setTablePageManager, setTablePagination } from '@/state/slices/tableSlice';
import { useAppDispatch, useAppSelector } from '@/state/store';

import { useSheetsApi } from './useSheetsApi';

export const useSheetsData = <T>(): [T[], number, () => void] => {
	const dispatch = useAppDispatch();
	const tableDataPerPage = useAppSelector((state) => state.table.tableDataPerPage);
	const tablePageManager = useAppSelector((state) => state.table.tablePageManager);
	// const tablePagination = useSelector(selectTablePagination);

	const parseData = <T extends Record<string, unknown>>(values: string[][]) => {
		const [headers, ...data] = values;
		// console.log(headers);
		// console.log(data);
		const formatTableData: T[] = [];

		for (let i = 0; i < data.length; i++) {
			const formattedData: T = {} as T;

			for (let j = 0; j < headers.length; j++) {
				const headerKey = headers[j].trim() as keyof T;
				// console.log(headerKey);
				// console.log(formattedData);

				// Type guard, checks if headerKey is a valid key in T (keyof T)
				// if (isValidKey(headerKey, formattedData)) {
				// console.log(formattedData);
				// console.log(headerKey);
				formattedData[headerKey] = data[i][j] as T[keyof T];
				// }
			}

			formatTableData.push(formattedData);
		}

		return formatTableData;
	};

	const api = getSheetsApi(SheetsColumn.DATA);
	const { data: dataFromSheets, mutate } = useSheetsApi<SheetsData, T[]>(api, parseData, false);
	// console.log('dataFromSheets', dataFromSheets);
	// dispatch Pagination
	useEffect(() => {
		if (!dataFromSheets) return;
		// console.log(tablePageManager);
		// const { pagination } = data;
		dispatch(
			setTablePagination({
				current_page: tablePageManager[TableType.TSheets]?.currentPage,
				current_page_value_from: tableDataPerPage * (tablePageManager[TableType.TSheets]?.currentPage - 1) + 1,
				current_page_value_to:
					Math.ceil(dataFromSheets.length / tableDataPerPage) === tablePageManager[TableType.TSheets]?.currentPage
						? dataFromSheets.length
						: tableDataPerPage * tablePageManager[TableType.TSheets]?.currentPage,
				num_values: dataFromSheets.length,
				total_pages: Math.ceil(dataFromSheets.length / tableDataPerPage),
			}),
		);
	}, [dataFromSheets, tablePageManager, dispatch, tableDataPerPage]);

	useEffect(() => {
		// console.log(tablePageManager);
		if (!tablePageManager[TableType.TSheets])
			dispatch(
				setTablePageManager({
					...tablePageManager,
					[TableType.TSheets]: {
						currentPage: 1,
						currentPerPage: 5,
					},
				}),
			);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dispatch, tablePageManager]);
	// console.log(dataFromSheets);

	const dataLength = dataFromSheets?.length ?? 0;
	const startIndex = tableDataPerPage * (tablePageManager[TableType.TSheets]?.currentPage - 1);
	const endIndex =
		Math.ceil(dataLength / tableDataPerPage) === tablePageManager[TableType.TSheets]?.currentPage
			? dataLength
			: tableDataPerPage * tablePageManager[TableType.TSheets]?.currentPage;

	// console.log(startIndex, endIndex);

	return [dataFromSheets?.slice(startIndex, endIndex) ?? [], dataLength, mutate];
};
