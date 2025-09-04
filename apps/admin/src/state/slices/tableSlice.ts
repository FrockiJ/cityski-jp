import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { OrderByType } from '@repo/shared';

import { PaginationData, TablePageManager, TableSliceState } from '@/shared/types/stateModel';

// Initial State
const initialState: TableSliceState = {
	tablePageManager: {
		table: {
			currentPage: 0,
			currentPerPage: 10,
		},
	},
	tableDataPerPage: 5,
	tableSort: {
		order: null,
		orderBy: '',
	},
	tablePageManager2: {
		table: 1,
	},
	tablePagination: {
		current_page: 1,
		total_pages: 0,
		current_page_value_from: 0,
		current_page_value_to: 0,
		num_values: 0,
	},
};

// Reducers
export const tableSlice = createSlice({
	name: 'table',
	initialState,
	reducers: {
		setTablePageManager: (state: TableSliceState, { payload }: PayloadAction<TablePageManager>) => {
			state.tablePageManager = payload;
		},
		setTableDataPerPage: (state: TableSliceState, { payload }: PayloadAction<number>) => {
			state.tableDataPerPage = payload;
		},
		setTableSort: (
			state: TableSliceState,
			{ payload }: PayloadAction<{ order: OrderByType | null; orderBy: string }>,
		) => {
			state.tableSort = payload;
		},
		setTablePagination: (state: TableSliceState, { payload }: PayloadAction<PaginationData | undefined>) => {
			state.tablePagination = payload;
		},
		setNewTableInfo: (state: TableSliceState, { payload }: PayloadAction<TablePageManager>) => {
			state.tablePageManager = {
				...state.tablePageManager,
				...payload,
			};
		},
	},
});

export const { setTablePageManager, setTableDataPerPage, setTableSort, setTablePagination, setNewTableInfo } =
	tableSlice.actions;

export default tableSlice.reducer;
