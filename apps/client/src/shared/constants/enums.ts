export type EnumValues<T> = T[keyof T];

export enum NavIconName {
	HOME,
	PIE,
	ALERT,
	ANALYZER,
	DEVICE,
	SETTINGS,
	CLIPBOARD,
}

export enum ArrowDirection {
	UP,
	DOWN,
}

export enum StatusTabs {
	ALL = 0,
	CRITICAL = 1,
	URGENT = 2,
	WARNING = 3,
	UNKNOWN = 4,
}

export enum TableType {
	T1 = 'Table 1',
	T2 = 'Table 2',
	T3 = 'Table 3',
	TRole = 'Table Role 1',
	TAccount = 'Table Account 1',
	TSelectSort = 'Table Select Sort',
	Sheets = 'Google Sheets',
	Demo = 'Demo',
	TCheckbox = 'TCheckbox',
	TDynamicTable = 'TDynamicTable',
}

export enum MessageType {
	SUCCESS = 'success',
	WARNING = 'warning',
	ERROR = 'error',
	INFO = 'info',
}

export enum Delay {
	SHORT = 500,
	NORMAL = 1000,
	LONG = 3000,
}

export enum RefreshTokenIOChoice {
	GET,
	SET,
}

export enum Defaults {
	DEFAULT_HOME_ROUTE = '/docs/tutorial-usage',
}

export enum Navs {
	EXAMPLE_PAGE = 'Example Page',
	EXAMPLE_EXPANDABLE = 'Example Expandable',
	EXAMPLE_PRIVATE_API = 'Example Private Api',
}

export enum LayoutType {
	AUTH,
	DEFAULT,
}

export enum RequestType {
	PUT = 'put',
	POST = 'post',
	PATCH = 'patch',
	DELETE = 'delete',
}

export enum TableManagementType {
	EDIT = 'EDIT',
	DELETE = 'DELETE',
}

export enum SheetsColumn {
	PAGE_HEADER = 'Page Header',
	COLUMN_HEADER = 'Column Header',
	TOOLBAR = 'Toolbar',
	TABLE = 'Table',
	FILTER = 'Filter',
	DATA = 'Data',
}

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
	MANAGEMENT = 'management',
}

export const BookingFormArea = {
	FORM: 'form',
	SELECT_PLAN: 'plan',
	SELECT_PARTICIPANT: 'participants',
	SELECT_DATE_TIME: 'dateTime',
} as const;

export type BookingFormAreaEnum = EnumValues<typeof BookingFormArea>;
