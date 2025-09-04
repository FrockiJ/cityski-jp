import { ColumnType, CourseTableListResult, GetCoursesRequestDTO, TableColumnType, TableConfig } from '@repo/shared';

import { blueTheme, greenTheme, greyTheme, yellowTheme } from '@/components/Common/CIBase/Tag/styles';

const statusTagStyles = {
	草稿: yellowTheme,
	排程中: blueTheme,
	已上架: greenTheme,
	已下架: greyTheme,
};

export const getCoursesTableConfigColumn: TableColumnType<CourseTableListResult>[] = [
	{
		name: '課程編號',
		key: 'no',
		type: ColumnType.CONTENT,
		width: 110,
		sort: true,
	},
	{
		name: '課程名稱',
		key: 'name',
		type: ColumnType.CONTENT,
		width: 200,
		sort: true,
	},
	{
		name: '狀態',
		key: 'status',
		type: ColumnType.TAG,
		width: 90,
		styles: statusTagStyles,
		sort: true,
	},
	{
		name: '類型',
		key: 'type',
		type: ColumnType.CONTENT,
		width: 90,
		sort: true,
	},
	{
		name: '課程預約形式',
		key: 'bkgType',
		type: ColumnType.CONTENT,
		width: 110,
		sort: true,
	},
	{
		name: '課程上架時間',
		key: 'releaseDate',
		type: ColumnType.CONTENT,
		width: 110,
		sort: true,
	},
	{
		name: '課程下架時間',
		key: 'removalDate',
		type: ColumnType.CONTENT,
		width: 110,
		sort: true,
	},
	{
		name: '最後編輯時間',
		key: 'updatedTime',
		type: ColumnType.CONTENT,
		width: 110,
		sort: true,
	},
];

export const configCoursesTable: TableConfig<CourseTableListResult, GetCoursesRequestDTO> = {
	tableId: 'CoursesTableListResult',
	columns: getCoursesTableConfigColumn,
	unfilteredFields: (_query) => [],
};
