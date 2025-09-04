import {
	ColumnType,
	FrontendMemberManagementTableListResult,
	GetMembersRequestDto,
	TableColumnType,
	TableConfig,
} from '@repo/shared';

export const getFrontendMemberManagementTableConfigColumn: TableColumnType<FrontendMemberManagementTableListResult>[] =
	[
		{ name: '狀態', key: 'status', width: 120, label: '狀態', type: ColumnType.SWITCH },
		{
			name: '會員編號',
			key: 'no',
			type: ColumnType.CONTENT,
			width: 100,
			sort: true,
		},
		{
			name: '姓名',
			key: 'name',
			type: ColumnType.CONTENT,
			width: 150,
			sort: true,
		},
		{
			name: '手機',
			key: 'phone',
			type: ColumnType.CONTENT,
			width: 120,
			sort: true,
		},
		{
			name: '單板等級',
			key: 'snowboard',
			type: ColumnType.CONTENT,
			width: 100,
			sort: true,
		},
		{
			name: '雙板等級',
			key: 'skis',
			type: ColumnType.CONTENT,
			width: 100,
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
			name: '註冊方式',
			key: 'type',
			type: ColumnType.CONTENT,
			width: 100,
			sort: true,
		},
		{
			name: '建立日期',
			key: 'createTime',
			type: ColumnType.CONTENT,
			width: 110,
			sort: true,
		},
	];

export const configFrontendMemberManagementTable: TableConfig<
	FrontendMemberManagementTableListResult,
	GetMembersRequestDto
> = {
	tableId: 'FrontendMemberManagementTableListResult',
	columns: getFrontendMemberManagementTableConfigColumn,
	unfilteredFields: (_query) => [],
};
