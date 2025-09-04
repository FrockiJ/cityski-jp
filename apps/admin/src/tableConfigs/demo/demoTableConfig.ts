import { ColumnType, QueryDemoDto, TableConfig, TableType } from '@repo/shared';

import { greenTheme, redTheme } from '@/CIBase/Tag/styles';
import { DemoListResultI } from '@/shared/core/constants/interface/listResults/demoResult';
import { TableColumnType } from '@/shared/types/dynamicTable';

const demoStatusTagStylesConfig = {
	InActive: redTheme,
	// "InActive": yellowTheme,
	Active: greenTheme,
	// "Refund done": greyTheme
};

const demoPermissionTagStylesConfig = {
	'Super Admin': redTheme,
	// "InActive": yellowTheme,
	Admin: greenTheme,
	// "Refund done": greyTheme
};

export const demoTableColumn: TableColumnType<DemoListResultI>[] = [
	{
		name: 'Name',
		key: 'name',
		entityKey: 'nameEn',
		type: ColumnType.CONTENT,
		width: 250,
		sort: true,
	},
	{
		name: 'Role',
		key: 'role',
		type: ColumnType.TAG,
		styles: demoPermissionTagStylesConfig,
		width: 200,
	},
	{
		name: 'Email',
		key: 'email',
		type: ColumnType.CONTENT,
		width: 350,
		sort: true,
	},
	{
		name: 'User Status',
		key: 'status',
		type: ColumnType.TAG,
		styles: demoStatusTagStylesConfig,
		width: 200,
		sort: true,
	},
	{
		name: 'Create Date',
		key: 'createdDate',
		type: ColumnType.CONTENT,
		width: 200,
		sort: true,
	},
	{ name: '', label: '', type: ColumnType.MANAGEMENT, width: 100 },
	{ name: '', width: 100 },
];

export const demoTableConfig: TableConfig<DemoListResultI, QueryDemoDto> = {
	tableId: TableType.TDemo,
	columns: demoTableColumn,
	unfilteredFields: (_query) => [],
};
