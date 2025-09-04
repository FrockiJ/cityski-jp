import {
	ColumnType,
	GetRolesRequestDTO,
	GetUsersRequestDTO,
	RoleTableListResult,
	TableColumnType,
	TableConfig,
	UserTableListResult,
} from '@repo/shared';

export const getRoleTableConfigColumn: TableColumnType<RoleTableListResult>[] = [
	{ name: '', key: 'status', width: 120, label: '啟用', type: ColumnType.SWITCH },
	{
		name: '角色名稱',
		key: 'name',
		type: ColumnType.CONTENT,
		width: 110,
		sort: true,
	},
	{
		name: '角色使用人數',
		key: 'usageCount',
		type: ColumnType.CONTENT,
		width: 120,
		sort: true,
	},
	{
		name: '修改日期',
		key: 'updatedTime',
		type: ColumnType.CONTENT,
		width: 200,
		sort: true,
	},
	{ name: '', label: '', type: ColumnType.MANAGEMENT, width: 100 },
	{ name: '', width: 100 },
];

export const configRoleTable: TableConfig<RoleTableListResult, GetRolesRequestDTO> = {
	tableId: 'RoleTableListResult',
	columns: getRoleTableConfigColumn,
	unfilteredFields: (_query) => [],
};

export const getUserTableConfigColumn: TableColumnType<UserTableListResult>[] = [
	{ name: '', key: 'status', width: 120, label: '啟用', type: ColumnType.SWITCH },
	{
		name: '使用者名稱',
		key: 'name',
		type: ColumnType.CONTENT,
		width: 110,
		sort: true,
	},
	{
		name: '角色',
		key: 'roles',
		type: ColumnType.CONTENT,
		width: 300,
		sort: true,
	},
	{
		name: 'Email',
		key: 'email',
		type: ColumnType.CONTENT,
		width: 250,
		sort: true,
	},
	{
		name: '修改日期',
		key: 'updatedTime',
		type: ColumnType.CONTENT,
		width: 200,
		sort: true,
	},
	{ name: '', label: '', type: ColumnType.MANAGEMENT, width: 100 },
	{ name: '', width: 100 },
];

export const configUserTable: TableConfig<UserTableListResult, GetUsersRequestDTO> = {
	tableId: 'UserTableListResult',
	columns: getUserTableConfigColumn,
	unfilteredFields: (_query) => [],
};
