import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MenuDTO } from '@repo/shared';

import { Permissions } from '@/shared/types/auth';
import { AuthSliceState } from '@/shared/types/stateModel';

const initialState: AuthSliceState = {
	accessToken: '',
	navList: [],
	permissions: undefined,
};

export const authSlice = createSlice({
	name: 'Auth State',
	initialState,
	reducers: {
		setAuthToken: (state: AuthSliceState, { payload }: PayloadAction<string>) => {
			state.accessToken = payload;
		},
		setNavList: (state: AuthSliceState, { payload }: PayloadAction<MenuDTO[]>) => {
			state.navList = payload;
		},
		setPermissions: (state: AuthSliceState, { payload }: PayloadAction<Permissions | undefined>) => {
			state.permissions = payload;
		},
	},
});

export const { setAuthToken, setNavList, setPermissions } = authSlice.actions;
export default authSlice.reducer;
