import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

import { MessageModalCustomProps, ModalCustomProps } from '@/shared/core/Types/modal';
import { ActiveNavInfo, LayoutSliceState } from '@/shared/types/stateModel';

// Initial State
const initialState: LayoutSliceState = {
	pageTitle: '',
	layoutTransition: false,
	activeNav: {
		activeParent: '',
		activeCurrentNav: '',
	},
	modalList: [],
	messageModalList: [],
	themeMode: 'light',
};

// Reducers
export const layoutSlice = createSlice({
	name: 'layout',
	initialState,
	reducers: {
		// allows for animations / transition affects when app is checking auth status
		setLayoutTransition: (state: LayoutSliceState, { payload }: PayloadAction<boolean>) => {
			state.layoutTransition = payload;
		},
		setActiveNav: (state: LayoutSliceState, { payload }: PayloadAction<ActiveNavInfo>) => {
			state.activeNav = payload;
		},
		setModal: (state: LayoutSliceState, { payload }: PayloadAction<ModalCustomProps>) => {
			const id = uuidv4();
			state.modalList = [...state.modalList, { id, open: true, ...payload }];
		},
		closeModal: (state: LayoutSliceState, { payload }: PayloadAction<string>) => {
			state.modalList.forEach((modal) => {
				if (modal.id === payload) {
					modal.open = false;
				}
			});
		},
		removeModal: (state: LayoutSliceState, { payload }: PayloadAction<string>) => {
			const newModalList = state.modalList.filter((modal) => modal.id !== payload);
			state.modalList = newModalList;
		},
		removeAllModal: (state: LayoutSliceState) => {
			state.modalList = [];
		},
		setMessageModal: (state: LayoutSliceState, { payload }: PayloadAction<MessageModalCustomProps>) => {
			const id = uuidv4();
			state.messageModalList = [...state.messageModalList, { id, open: true, ...payload }];
		},
		closeMessageModal: (state: LayoutSliceState, { payload }: PayloadAction<string>) => {
			state.messageModalList.forEach((modal) => {
				if (modal.id === payload) {
					modal.open = false;
				}
			});
		},
		removeMessageModal: (state: LayoutSliceState, { payload }: PayloadAction<string>) => {
			const newModalList = state.messageModalList.filter((modal) => modal.id !== payload);
			state.messageModalList = newModalList;
		},
		setThemeMode: (state: LayoutSliceState, { payload }: PayloadAction<'dark' | 'light'>) => {
			state.themeMode = payload;
		},
	},
});

export const {
	setLayoutTransition,
	setModal,
	setActiveNav,
	closeModal,
	removeModal,
	removeAllModal,
	setMessageModal,
	closeMessageModal,
	removeMessageModal,
	setThemeMode,
} = layoutSlice.actions;

export default layoutSlice.reducer;
