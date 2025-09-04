import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

import authReducer from './slices/authSlice';
import dynamicReducer from './slices/dynamicTableSlice';
import layoutReducer from './slices/layoutSlice';
import optionReducer from './slices/optionSlice';
import searchFilterReducer from './slices/searchFilterSlice';
import tableReducer from './slices/tableSlice';
import userReducer from './slices/userSlice';

// store
export const store = configureStore({
	reducer: {
		user: userReducer,
		layout: layoutReducer,
		auth: authReducer,
		table: tableReducer,
		dynamicTable: dynamicReducer,
		searchFilter: searchFilterReducer,
		option: optionReducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: false,
		}),
});

// define types for redux
// RootState inferred type
export type RootState = ReturnType<typeof store.getState>;

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<typeof store.dispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
