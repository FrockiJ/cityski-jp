import { ColumnType, DiscountTableListResult, GetDiscountRequestDTO, TableColumnType, TableConfig } from '@repo/shared';

import { greenTheme, greyTheme, redTheme } from '@/components/Common/CIBase/Tag/styles';

const discountTagStyles = {
	啟用中: greenTheme,
	已停用: redTheme,
	已過期: greyTheme,
};

export const getDiscountTableConfigColumn: TableColumnType<DiscountTableListResult>[] = [
	{ name: '', key: 'status', width: 120, label: '啟用', type: ColumnType.SWITCH },
	{
		name: '折扣碼名稱',
		key: 'code',
		type: ColumnType.CONTENT,
		width: 110,
	},
	{
		name: '狀態',
		key: 'statusTag',
		type: ColumnType.TAG,
		width: 100,
		styles: discountTagStyles,
		sort: true,
	},
	{
		name: '折扣',
		key: 'discount',
		type: ColumnType.CONTENT,
		width: 100,
		sort: true,
	},
	{
		name: '到期日期',
		key: 'endDate',
		type: ColumnType.CONTENT,
		width: 120,
		sort: true,
	},
	{
		name: '建立日期',
		key: 'createdTime',
		type: ColumnType.CONTENT,
		width: 120,
		sort: true,
	},
	{
		name: '人數限制',
		key: 'usageLimit',
		type: ColumnType.CONTENT,
		width: 100,
		sort: true,
	},
	{ name: '備註', key: 'note', type: ColumnType.CONTENT, width: 300 },
];

export const configDiscountTable: TableConfig<DiscountTableListResult, GetDiscountRequestDTO> = {
	tableId: 'DiscountTableListResult',
	columns: getDiscountTableConfigColumn,
	unfilteredFields: (_query) => [],
};
