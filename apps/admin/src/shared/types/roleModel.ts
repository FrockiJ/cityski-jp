import { DemoNavIconName } from '@/shared/constants/enums';

export type RoleRowData = {
	id: string;
	name: string;
	number: number;
	status: string;
	super_adm: '0' | '1';
	updated_time: string;
};

export type RoleAccessModel = {
	label: string;
	children: Children[];
};

export type Children = {
	label: string;
	group: { checked: boolean; label: string; type: string; value: number }[];
};

export type RoleAccessResModel = {
	id: number;
	menu: string;
	page: string;
	menu_auths: {
		id: number;
		auth_type: 'R' | 'E';
		checked: boolean;
	}[];
};

export type GetRoleAccessResModel = {
	id: number;
	super_adm: string;
	status: string;
	name: string;
	roleMenus: {
		id: number;
		menu: string;
		page: string;
		url: string;
		auth_type: 'R' | 'E';
		status: string;
	}[];
};

export type RoleMenuData = {
	role_id: number;
	role_name: string;
};

export type NavWithPermissionModel = {
	id: string;
	pageName: string;
	path: string;
	icon?: DemoNavIconName;
	permissions: {
		view: boolean;
		edit: boolean;
	};
	subPages: NavWithPermissionModel[];
};
