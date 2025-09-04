/**
 * Redux slice for managing userInfo and authorization accessTokens in memory
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MemberDto } from '@repo/shared';

import { AuthSliceState } from '@/shared/types/stateModel';

const initialState: AuthSliceState = {
	userInfo: null,
	accessToken: '',
};

export const authSlice = createSlice({
	name: 'Auth State',
	initialState,
	reducers: {
		setAuthToken: (state: AuthSliceState, { payload }: PayloadAction<string>) => {
			state.accessToken = payload;
		},
		setUserInfo: (state: AuthSliceState, { payload }: PayloadAction<MemberDto>) => {
			state.userInfo = payload;
		},
	},
});

// Selectors
export const selectToken = (state: {
	auth: {
		accessToken: string;
	};
}) => state.auth.accessToken;

export const selectUserInfo = (state: {
	auth: {
		userInfo: MemberDto;
	};
}) => state.auth.userInfo;

export const { setAuthToken, setUserInfo } = authSlice.actions;
export default authSlice.reducer;
