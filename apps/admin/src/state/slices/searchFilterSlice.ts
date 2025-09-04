import { MultiValue, SingleValue } from 'react-select';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FilterContext, Option } from '@repo/shared';

interface State {
	filterManager: {
		[key: string]: FilterContext;
	};
}

// Initial State
const initialState: State = {
	filterManager: {},
};

// Reducers
export const searchFilterSlice = createSlice({
	name: 'searchFilter',
	initialState,
	reducers: {
		addFilterItem: (
			state: State,
			{
				payload,
			}: PayloadAction<{
				tableId: string;
				key: string;
				option: MultiValue<Option> | SingleValue<Option> | string | Date;
			}>,
		) => {
			state.filterManager = {
				...state.filterManager,
				[payload.tableId]: {
					...state.filterManager[payload.tableId],
					[payload.key]: payload.option,
				},
			};
		},
		deleteFilterItem: (
			state: State,
			{
				payload,
			}: PayloadAction<{
				tableId: string;
				key: string;
				option: MultiValue<Option> | SingleValue<Option> | string | Date;
			}>,
		) => {
			if (payload.option && Array.isArray(payload.option) && payload.option?.length === 0) {
				delete state.filterManager[payload.tableId][payload.key];
			} else if (payload.option?.hasOwnProperty('value')) {
				delete state.filterManager[payload.tableId][payload.key];
			} else {
				state.filterManager = {
					[payload.tableId]: {
						...state.filterManager[payload.tableId],
						[payload.key]: payload.option,
					},
				};
			}
		},
		resetFilterState() {
			return initialState;
		},
	},
});

// Action creators
export const { addFilterItem, deleteFilterItem, resetFilterState } = searchFilterSlice.actions;

// Reducer
export default searchFilterSlice.reducer;
