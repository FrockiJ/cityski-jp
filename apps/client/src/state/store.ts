'use client';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

import authReducer from './slices/authSlice';
import infoReducer from './slices/infoSlice';
import layoutReducer from './slices/layoutSlice';

// store
export const store = configureStore({
	reducer: {
		layout: layoutReducer,
		auth: authReducer,
		info: infoReducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: false,
		}),
});

// define types for redux
// IRootState inferred type
export type RootState = ReturnType<typeof store.getState>;

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<typeof store.dispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
