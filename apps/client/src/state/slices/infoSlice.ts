import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Department {
	id: string;
	name: string;
	address: string | null;
	phone: string | null;
	sequence: number;
	status: number;
}

export interface Discount {
	id: string;
	code: string;
	departmentId: string;
	discount: number;
	status: number;
	type: string;
	usageCount: number;
	usageLimit: number;
}

export interface InfoState {
	department: Department | null;
	discount: Discount | null;
}

const initialState: InfoState = {
	department: null,
	discount: null,
};

export const infoSlice = createSlice({
	name: 'Info State',
	initialState,
	reducers: {
		setDepartment: (state: InfoState, { payload }: PayloadAction<Department>) => {
			state.department = payload;
		},
		setDiscount: (state: InfoState, { payload }: PayloadAction<Discount | null>) => {
			state.discount = payload;
		},
	},
});

// Selectors
export const selectDepartment = (state: { info: InfoState }) => state.info.department;
export const selectDiscount = (state: { info: InfoState }) => state.info.discount;

export const { setDepartment, setDiscount } = infoSlice.actions;
export default infoSlice.reducer;
