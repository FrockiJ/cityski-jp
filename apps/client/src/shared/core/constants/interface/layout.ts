import { MultiValue } from 'react-select';
import { FilterType, ListResultI, NavIconName, PropertyTypeFactory, TableColumn } from '@repo/shared';
import { TableType } from '../../../constants/enums';

// import { ColumnType, FilterType, NavIconName, OrderType } from '../enum';

export interface NavList {
	name: string;
	navs: AdminNavModel[];
	path: string;
}

export interface AdminNavModel {
	name: string;
	path: string;
	icon?: NavIconName;
	subNav?: SubNav[];
}

export interface SubNav {
	name: string;
	path: string;
}

export interface NavDataI {
	code: string;
	pageName: string;
	path: string;
	icon?: NavIconName;
	sequence?: number;
	permissions: {
		view: boolean;
		edit: boolean;
	};
	subPages: NavDataI[];
}

export interface TableConfig<T extends ListResultI, Q = never> {
	tableId: TableType;
	columns: TableColumn<T>[];
	unfilteredFields?: PropertyTypeFactory<Q>;
}

// export type TableColumnType<T> = TableColumn<T> | TagTableColumn<T>;

// export interface TableColumn<T> {
//   name: string;
//   key?: keyof T;
//   entityKey?: string;
//   width?: string | number;
//   sort?: boolean;
//   label?: string;
//   end?: boolean;
//   type?: ColumnType;
//   sx?: any | undefined;
//   isDivider?: boolean;
//   handleChange?: (
//     event: any,
//     id: string,
//     checked: boolean,
//     ...args: any
//   ) => void;
// }

// export interface TagTableColumn<T> extends TableColumn<T> {
//   type: ColumnType.TAG;
//   styles?: ColumnTagStyles;
// }

// export interface ColumnTagStyle {
//   color: string;
//   backgroundColor: (theme: Theme) => string | string;
// }
// export interface ColumnTagStyles {
//   [key: string]: ColumnTagStyle;
// }

// export type SortType = {
//   type: string;
//   order: OrderType;
// };

// export interface FilterContext {
//   [key: string]: MultiValue<Option> | SingleValue<Option> | string | Date;
// }

export interface FilterField {
	key: string;
	options: MultiValue<Option> | string | Date;
	type: FilterType;
	label: string;
	sequence: number;
	placeholder?: string;
	startDateKey?: string;
	endDateKey?: string;
}

export type Option = CheckboxOption | SelectOption | RadioOption;

export type CheckboxOption = {
	label: string;
	value: string;
};

export type SelectOption = {
	label: string;
	value: string | number;
	isFixed?: boolean;
};

export type RadioOption = {
	label: string;
	value: string | number;
};

export interface MoreOption {
	label: string;
	onClick: (id: string, rowData?: any) => void;
}
