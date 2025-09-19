import { ColumnType, GetCoursesRequestDTO, OrderTableListResult, TableColumnType, TableConfig } from '@repo/shared';

import { blueTheme, greenTheme, greyTheme, redTheme, yellowTheme } from '@/components/Common/CIBase/Tag/styles';

const statusTagStyles = {
	待付訂金: yellowTheme,
	等待確認: blueTheme,
	訂購成功: redTheme,
	訂單完成: greyTheme,
};

export const getOrdersTableConfigColumn: TableColumnType<any>[] = [
	{
		name: '訂單編號',
		key: 'no',
		type: ColumnType.CONTENT,
		width: 110,
		sort: false,
	},
	{
		name: '課程名稱',
		key: 'name',
		type: ColumnType.CONTENT,
		width: 100,
		sort: false,
	},
	{
		name: '訂單金額(NT$)',
		key: 'amount',
		type: ColumnType.CONTENT,
		width: 80,
		sort: false,
	},
	{
		name: '訂單狀態',
		key: 'status',
		type: ColumnType.TAG,
		width: 40,
		styles: statusTagStyles,
		sort: false,
	},
	{
		name: '付款狀態',
		key: 'payStatus',
		type: ColumnType.TAG,
		width: 40,
		styles: statusTagStyles,
		sort: false,
	},
	{
		name: '堂數',
		key: 'lessons',
		type: ColumnType.CONTENT,
		width: 60,
		sort: false,
	},
	{
		name: '人數',
		key: 'people',
		type: ColumnType.CONTENT,
		width: 60,
		sort: false,
	},
	{
		name: '預約進度',
		key: 'progress',
		type: ColumnType.CONTENT,
		width: 60,
		sort: false,
	},
	{
		name: '訂購時間',
		key: 'orderTime',
		type: ColumnType.CONTENT,
		width: 110,
		sort: true,
	},
];

export const configOrdersTable: TableConfig<any, GetCoursesRequestDTO> = {
	tableId: 'ordersTableList',
	columns: getOrdersTableConfigColumn,
	unfilteredFields: (_query) => [],
};
