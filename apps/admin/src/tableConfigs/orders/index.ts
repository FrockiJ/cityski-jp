import { ColumnType, GetCoursesRequestDTO, OrderTableListResult, TableColumnType, TableConfig } from '@repo/shared';

import { blueTheme, greenTheme, greyTheme, redTheme, yellowTheme } from '@/components/Common/CIBase/Tag/styles';

const statusTagStyles = {
	已完成: greenTheme,
	待紀錄: yellowTheme,
	已排定: blueTheme,
	已取消: redTheme,
	未預約: greyTheme,
};

export const getOrdersTableConfigColumn: TableColumnType<OrderTableListResult>[] = [
	{
		name: '訂單編號',
		key: 'no',
		type: ColumnType.CONTENT,
		width: 70,
		sort: false,
	},
	{
		name: '課程名稱',
		key: 'name',
		type: ColumnType.CONTENT,
		width: 110,
		sort: false,
	},
	{
		name: '訂單金額(NT$)',
		key: 'amount',
		type: ColumnType.CONTENT,
		width: 60,
		sort: false,
	},
	{
		name: '訂單狀態',
		key: 'status',
		type: ColumnType.TAG,
		width: 60,
		styles: statusTagStyles,
		sort: false,
	},
	{
		name: '付款狀態',
		key: 'payStatus',
		type: ColumnType.CONTENT,
		width: 60,
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

export const configOrdersTable: TableConfig<OrderTableListResult, GetCoursesRequestDTO> = {
	tableId: 'OrdersTableListResult',
	columns: getOrdersTableConfigColumn,
	unfilteredFields: (_query) => [],
};
