'use client';
/**
 * Redux slice for managing layout-related state
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

import { LayoutType } from '@/shared/constants/enums';
import { MessageModalCustomProps, MessageModalProps, ModalCustomProps, ModalProps } from '@/shared/core/Types/modal';
import { LayoutSliceState } from '@/shared/types/stateModel';

// Initial State
const initialState: LayoutSliceState = {
	pageTitle: '',
	layoutTransition: true,
	modalLayer: 0,
	menuToggled: false,
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
		// change the global layout style
		setLayout: (state: LayoutSliceState, { payload }: PayloadAction<LayoutType>) => {
			console.log('layout payload:', payload);
			state.layoutType = payload;
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

// Selectors

export const selectLayoutTransition = (state: { layout: { layoutTransition: boolean } }) =>
	state.layout.layoutTransition;

export const selectLayout = (state: {
	layout: {
		layoutType: LayoutType;
	};
}) => state.layout.layoutType;

export const selectModal = (state: {
	layout: {
		modal: ModalProps;
	};
}) => state.layout.modal;

export const selectModal2 = (state: {
	layout: {
		modal2: ModalProps;
	};
}) => state.layout.modal2;

export const selectMenuToggled = (state: {
	layout: {
		menuToggled: boolean;
	};
}) => state.layout.menuToggled;

export const selectModalList = (state: {
	layout: {
		modalList: ModalProps[];
	};
}) => state.layout.modalList;

export const selectMessageModalList = (state: {
	layout: {
		messageModalList: MessageModalProps[];
	};
}) => state.layout.messageModalList;

export const selectThemeMode = (state: {
	layout: {
		themeMode: 'dark' | 'light';
	};
}) => state.layout.themeMode;

export const {
	setLayout,
	setLayoutTransition,
	setModal,
	closeModal,
	removeModal,
	setMessageModal,
	closeMessageModal,
	removeMessageModal,
	setThemeMode,
} = layoutSlice.actions;

export default layoutSlice.reducer;
