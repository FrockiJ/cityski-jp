import { CmsTableListResult, ColumnType, TableColumnType, TableConfig } from '@repo/shared';

export const getCmsTableConfigColumn: TableColumnType<CmsTableListResult>[] = [
	{
		name: '首頁區塊',
		key: 'homeAreaTitle',
		type: ColumnType.CONTENT,
		width: 100,
		sort: false,
	},
	{
		name: '編輯人員',
		key: 'updatedUser',
		type: ColumnType.CONTENT,
		width: 100,
		sort: false,
	},
	{
		name: '最後編輯日期',
		key: 'updatedTime',
		type: ColumnType.CONTENT,
		width: 100,
		sort: false,
	},
	{ name: '', width: 400, type: ColumnType.EMPTY },
];

export const configCmsTable: TableConfig<CmsTableListResult> = {
	tableId: 'CmsTableListResult',
	columns: getCmsTableConfigColumn,
	unfilteredFields: (_query) => [],
};
