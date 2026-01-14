import { Theme } from '@mui/material';

import { ColumnType } from '@/shared/constants/enums';

import { PropertyTypeFactory } from './common';

export interface TableConfig<T extends ListResultI, Q = never> {
	tableId: string;
	columns: TableColumn<T>[];
	unfilteredFields?: PropertyTypeFactory<Q>;
}

export type TableColumnType<T> = TableColumn<T> | TagTableColumn<T> | SelectTableColumn<T>;

export interface TableColumn<T> {
	name: string;
	key?: keyof T;
	entityKey?: string;
	width?: string | number;
	sort?: boolean;
	label?: string;
	end?: boolean;
	type?: ColumnType;
	sx?: any | undefined;
	handleChange?: (event: any, id: string, checked: boolean, ...args: any) => void;
	align?: 'left' | 'right' | undefined;
	position?: 'start' | 'middle' | undefined;
}

export interface TagTableColumn<T> extends TableColumn<T> {
	type: ColumnType.TAG;
	styles?: ColumnTagStyles;
}

export interface SelectTableColumn<T> extends TableColumn<T> {
	type: ColumnType.SELECT;
	getOptions: (row: T) => SelectOption[];
	onSelectChange: (rowId: string, newValue: string, row: T) => Promise<void>;
	isDisabled?: (row: T) => boolean;
}

export interface SelectOption {
	label: string;
	value: string | number;
	isFixed?: boolean;
	isDisabled?: boolean;
}

export interface ColumnTagStyle {
	color: string;
	backgroundColor: (theme: Theme) => string;
}

export interface ColumnTagStyles {
	[key: string]: ColumnTagStyle;
}

export type AlignType = 'left' | 'right' | undefined;

export type PositionType = 'start' | 'middle' | undefined;

export interface ListResultI {
	id: string;
	disabled?: boolean;
}
