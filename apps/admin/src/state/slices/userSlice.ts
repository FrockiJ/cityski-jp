import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Department } from '@repo/shared';

import { SliceState } from '@/shared/types/stateModel';

const initialState: SliceState = {
	userInfo: null,
	departments: [],
};

export const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		setUserInfo: (state, { payload }) => {
			state.userInfo = { ...payload };
		},
		setUserDepartments: (state, { payload }: PayloadAction<Department[]>) => {
			state.departments = payload;
		},
		resetUserState: () => initialState,
	},
});

export const { setUserInfo, setUserDepartments, resetUserState } = userSlice.actions;
export default userSlice.reducer;
