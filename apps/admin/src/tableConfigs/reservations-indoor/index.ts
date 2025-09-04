import {
	ColumnType,
	GetCoursesRequestDTO,
	ReservationIndoorTableListResult,
	TableColumnType,
	TableConfig,
} from '@repo/shared';

import { blueTheme, greenTheme, greyTheme, redTheme, yellowTheme } from '@/components/Common/CIBase/Tag/styles';

const statusTagStyles = {
	已完成: greenTheme,
	待紀錄: yellowTheme,
	已排定: blueTheme,
	已取消: redTheme,
	未預約: greyTheme,
};

export const getReservationsIndoorTableConfigColumn: TableColumnType<ReservationIndoorTableListResult>[] = [
	{
		name: '預約編號',
		key: 'no',
		type: ColumnType.CONTENT,
		width: 70,
		sort: true,
	},
	{
		name: '課程名稱',
		key: 'name',
		type: ColumnType.CONTENT,
		width: 110,
		sort: true,
	},
	{
		name: '課程狀態',
		key: 'status',
		type: ColumnType.TAG,
		width: 60,
		styles: statusTagStyles,
		sort: true,
	},
	{
		name: '板類',
		key: 'boardType',
		type: ColumnType.CONTENT,
		width: 50,
		sort: true,
	},
	{
		name: '等級',
		key: 'level',
		type: ColumnType.CONTENT,
		width: 50,
		sort: true,
	},
	{
		name: '教練',
		key: 'instructor',
		type: ColumnType.CONTENT,
		width: 60,
		sort: true,
	},
	{
		name: '現有人數',
		key: 'number',
		type: ColumnType.CONTENT,
		width: 60,
		sort: true,
	},
	{
		name: '剩餘名額',
		key: 'remaining',
		type: ColumnType.CONTENT,
		width: 60,
		sort: true,
	},
	{
		name: '上課時間',
		key: 'beginTime',
		type: ColumnType.CONTENT,
		width: 110,
		sort: true,
	},
];

export const configReservationsIndoorTable: TableConfig<ReservationIndoorTableListResult, GetCoursesRequestDTO> = {
	tableId: 'ReservationsIndoorTableListResult',
	columns: getReservationsIndoorTableConfigColumn,
	unfilteredFields: (_query) => [],
};
