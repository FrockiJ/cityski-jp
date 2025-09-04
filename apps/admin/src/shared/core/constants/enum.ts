export type EnumValues<T> = T[keyof T];

export enum ColumnType {
	INDEX = 'index',
	CONTENT = 'content',
	IMAGE = 'image',
	SWITCH = 'switch',
	BLANK = 'blank',
	DELETE = 'delete',
	TAG = 'tag',
	MEDIA = 'media',
	EDIT = 'edit',
	EMPTY = 'empty',
	LIST_AND_TOOLTIP = 'listAndTooltip',
}

export enum TableManagementType {
	EDIT = 'EDIT',
	DELETE = 'DELETE',
}

export enum NavIconName {
	HOME,
	PIE,
	ALERT,
	ANALYZER,
	DEVICE,
	SETTINGS,
	CLIPBOARD,
}

export const UserStatus = {
	INACTIVE: 0,
	ACTIVE: 1,
	NOT_YET_VERIFIED: 2,
	DELETED: 9,
} as const;
export type UserStatus = EnumValues<typeof UserStatus>;

export const UserRole = {
	ADMIN: 'admin',
	SUPER_ADMIN: 'super admin',
	SWIMMER: 'swimmer',
	HOST: 'host',
} as const;
export type UserRole = EnumValues<typeof UserRole>;

export const HostPermission = {
	DISABLED: 0,
	ENABLED: 1,
	NOT_YET_VERIFIED: 3,
} as const;
export type HostPermission = EnumValues<typeof HostPermission>;

export const CourseType = {
	GROUP: 'G',
	PRIVATE: 'P',
	TRAINING: 'T',
} as const;
export type CourseType = EnumValues<typeof CourseType>;
