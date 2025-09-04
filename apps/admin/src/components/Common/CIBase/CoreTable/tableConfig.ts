import { TableType } from '@repo/shared';

export const renderHeader = (type: string) => {
	switch (type) {
		case TableType.T1:
			return [
				{ name: 'Conference', width: 120 },
				{ name: 'Division' },
				{ name: 'Created' },
				{ name: 'Team', width: 200 },
				{ name: 'Coach', width: 150 },
			];
		case TableType.T2:
			return [
				{ name: 'Conference', width: 120 },
				{ name: 'Division', sort: true },
				{ name: 'Created', sort: true },
				{ name: 'Team', width: 200 },
				{ name: 'News', width: 400 },
				{ name: 'Players', width: 200 },
				{ name: 'Coach', width: 150 },
			];
		case TableType.T3:
			return [
				{ name: 'Conference', width: 120 },
				{ name: 'Division', sort: true },
				{ name: 'Created', sort: true },
				{ name: 'Team', width: 200 },
				{ name: 'News', width: 400 },
				{ name: 'Players', width: 200 },
				{ name: 'Coach', width: 150 },
			];
		case TableType.TRole:
			return [
				{ name: '', width: 150 },
				{ name: '角色名稱', width: 200, sort: true, sortValue: 'name' },
				{ name: '角色使用人數', width: 150, sort: true, sortValue: 'number' },
				{ name: '修改日期', width: 200, sort: true, sortValue: 'updated_time' },
				{ name: 'management', hiddenName: true },
				{ name: '', width: 20 },
			];
		case TableType.TAccount:
			return [
				{ name: '', width: 150 },
				{ name: '使用者名稱', width: 200, sort: true, sortValue: 'user_name' },
				{ name: '角色', width: 150, sort: true, sortValue: 'role_id' },
				{ name: '帳號', width: 150, sort: true, sortValue: 'account' },
				{ name: '修改日期', width: 150, sort: true, sortValue: 'updated_time' },
				{ name: '', width: 50 },
				{ name: '' },
			];
		case TableType.TSelectSort:
			return [
				{ name: '排序', width: 150, sort: true },
				{ name: '使用者名稱', width: 200, sort: true, sortValue: 'user_name' },
				{ name: '角色', sort: true, sortValue: 'role_id' },
				{ name: '帳號', sort: true, sortValue: 'account' },
				{ name: '修改日期', sort: true, sortValue: 'updated_time' },
				{ name: 'management', hiddenName: true },
				{ name: '', width: 20 },
			];
		case TableType.TSheets:
			return [];
		default:
			return null;
	}
};
