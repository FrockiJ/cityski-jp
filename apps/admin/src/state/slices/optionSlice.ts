import { MultiValue } from 'react-select';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Option, OptionManagerType, OptionNames } from '@repo/shared';

import { fetchOptionData } from '@/hooks/useInitialOptions';

import { RootState } from '../store';

interface State {
	optionManager: {
		value: OptionManagerType;
		status: 'idle' | 'loading' | 'succeeded' | 'failed';
		error: string | null;
	};
}

// Initial State
const initialState: State = {
	optionManager: {
		value: {},
		status: 'idle', // 'idle', 'loading', 'succeeded', 'failed'
		error: null,
	},
};

// Reducers
export const optionSlice = createSlice({
	name: 'option',
	initialState,
	reducers: {
		addOptionItem: (
			state: State,
			{
				payload,
			}: PayloadAction<{
				key: OptionNames;
				option: MultiValue<Option>;
			}>,
		) => {
			state.optionManager = {
				...state.optionManager,
				value: {
					...state.optionManager.value,
					[payload.key]: payload.option as MultiValue<Option>,
				},
			};
		},
		deleteOptionItem: (
			state: State,
			{
				payload,
			}: PayloadAction<{
				key: OptionNames;
				option: MultiValue<Option>;
			}>,
		) => {
			if (payload.option && Array.isArray(payload.option) && payload.option?.length === 0) {
				delete state.optionManager.value[payload.key];
			} else {
				state.optionManager = {
					...state.optionManager,
					value: {
						...state.optionManager.value,
						[payload.key]: payload.option as MultiValue<Option>,
					},
				};
			}
		},
		setOptionData: (state, action) => {
			state.optionManager = action.payload;
		},
		resetOptionState() {
			return initialState;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchOptionData.fulfilled, (state: State, action: PayloadAction<OptionManagerType | undefined>) => {
				state.optionManager.status = 'succeeded';
				if (action.payload) {
					state.optionManager.value = action.payload;
				}
			})
			.addCase(fetchOptionData.rejected, (state, action) => {
				state.optionManager.status = 'failed';
				state.optionManager.error = String(action.error.message);
			})
			.addCase(fetchOptionData.pending, (state) => {
				state.optionManager.status = 'loading';
			});
	},
});

// Selectors
export const selectOptions = (key?: OptionNames) => (state: RootState) => {
	return key ? state.option.optionManager.value?.[key] : state.option.optionManager.value;
};

// Action creators
export const { setOptionData, addOptionItem } = optionSlice.actions;

// Reducer
export default optionSlice.reducer;
