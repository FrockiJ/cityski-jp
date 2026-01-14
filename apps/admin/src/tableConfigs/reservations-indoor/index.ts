import {
	ColumnType,
	GetReservationsRequestDto,
	ReservationIndoorTableListResult,
	TableColumnType,
	TableConfig,
	SelectTableColumn,
	SelectOption,
	ReservationStatus,
} from '@repo/shared';

import { blueTheme, greenTheme, greyTheme, redTheme, yellowTheme } from '@/components/Common/CIBase/Tag/styles';

const statusTagStyles = {
	已完成: greenTheme,
	待紀錄: yellowTheme,
	已排定: blueTheme,
	已取消: redTheme,
	未預約: greyTheme,
};

export const createReservationsIndoorTableConfig = (
	getCoachOptions: (departmentId: string) => SelectOption[],
	handleInstructorChange: (reservationId: string, newInstructor: string, row: any) => Promise<void>
): TableConfig<ReservationIndoorTableListResult, GetReservationsRequestDto> => {
	const columns: TableColumnType<ReservationIndoorTableListResult>[] = [
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
		type: ColumnType.SELECT,
		width: 60,
		sort: true,
		getOptions: (row) => getCoachOptions(row.departmentId),
		onSelectChange: async (rowId: string, newValue: string, row: any) => {
			await handleInstructorChange(rowId, newValue, row);
		},
		isDisabled: (row) => row.reservationStatus !== ReservationStatus.SCHEDULED,
	} as SelectTableColumn<ReservationIndoorTableListResult>,
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

	return {
		tableId: 'ReservationsIndoorTableListResult',
		columns,
		unfilteredFields: (_query) => [],
	};
};

// 創建基礎配置（用於其他不需要下拉選單的地方）
const baseColumns: TableColumnType<ReservationIndoorTableListResult>[] = [
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

// 保留原有的靜態配置導出，以便其他地方使用
export const getReservationsIndoorTableConfigColumn: TableColumnType<ReservationIndoorTableListResult>[] = baseColumns;

export const configReservationsIndoorTable: TableConfig<ReservationIndoorTableListResult, GetReservationsRequestDto> = {
	tableId: 'ReservationsIndoorTableListResult',
	columns: baseColumns,
	unfilteredFields: (_query) => [],
};
