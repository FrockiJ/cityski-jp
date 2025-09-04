import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { OrderByType } from '@repo/shared';

import { DynamicTableSliceState, PaginationData, TablePageManager } from '@/shared/types/stateModel';

// Initial State
const initialState: DynamicTableSliceState = {
	tablePageManager: {},
	tableDataPerPage: 5,
	tableSort: {
		order: null,
		orderBy: '',
	},
};

// Reducers
export const dynamicTableSlice = createSlice({
	name: 'table',
	initialState,
	reducers: {
		setTablePageManager: (state: DynamicTableSliceState, { payload }: PayloadAction<TablePageManager>) => {
			state.tablePageManager = payload;
		},
		setTableDataPerPage: (state: DynamicTableSliceState, { payload }: PayloadAction<number>) => {
			state.tableDataPerPage = payload;
		},
		setTableSort: (
			state: DynamicTableSliceState,
			{ payload }: PayloadAction<{ order: OrderByType | null; orderBy: string }>,
		) => {
			state.tableSort = payload;
		},
		setTablePagination: (state: DynamicTableSliceState, { payload }: PayloadAction<PaginationData | undefined>) => {
			state.tablePagination = payload;
		},
		setNewTableInfo: (state: DynamicTableSliceState, { payload }: PayloadAction<TablePageManager>) => {
			state.tablePageManager = {
				...state.tablePageManager,
				...payload,
			};
		},
	},
});

export const { setTablePageManager, setTableDataPerPage, setTableSort, setTablePagination } = dynamicTableSlice.actions;

export default dynamicTableSlice.reducer;
