import { DemoNavIconName } from '@/shared/constants/enums';

export const navData = {
	response_code: '',
	response_message: '',
	result_data: {
		userInfo: {
			roleId: 'user', // super admin/admin/user
			userName: 'CI Admin',
		},
		pages: [
			{
				id: 'Google Sheets API Table',
				pageName: 'Dashboard',
				path: '/google-sheets-table',
				permissions: {
					view: true,
					edit: true,
				},
				subPages: [],
			},
			{
				id: 'Tutorial Usage',
				pageName: 'Tutorial & Usage',
				path: '/docs/tutorial-usage',
				icon: DemoNavIconName.HOME,
				permissions: {
					view: true,
					edit: true,
				},
				subPages: [],
			},
			{
				id: 'components',
				pageName: 'Components',
				path: '/components',
				// icon: "user-icon",
				permissions: {
					view: true,
					edit: true,
				},
				subPages: [
					{
						id: 'button',
						pageName: 'Button',
						path: '/components/button',
						// icon: "view-icon",
						permissions: {
							view: true,
							edit: true,
						},
						subPages: [],
					},
					{
						id: 'label',
						pageName: 'Label',
						path: '/components/label',
						// icon: "edit-icon",
						permissions: {
							view: true,
							edit: true,
						},
						subPages: [],
					},
					{
						id: 'switch',
						pageName: 'Switch',
						path: '/components/switch',
						// icon: "edit-icon",
						permissions: {
							view: true,
							edit: true,
						},
						subPages: [],
					},
					{
						id: 'input',
						pageName: 'Input',
						path: '/components/input',
						// icon: "edit-icon",
						permissions: {
							view: true,
							edit: true,
						},
						subPages: [],
					},
					{
						id: 'select',
						pageName: 'Select',
						path: '/components/select',
						// icon: "edit-icon",
						permissions: {
							view: true,
							edit: true,
						},
						subPages: [],
					},
					{
						id: 'radio',
						pageName: 'Radio',
						path: '/components/radio',
						// icon: "edit-icon",
						permissions: {
							view: true,
							edit: true,
						},
						subPages: [],
					},
					{
						id: 'checkbox',
						pageName: 'Checkbox',
						path: '/components/checkbox',
						// icon: "edit-icon",
						permissions: {
							view: true,
							edit: true,
						},
						subPages: [],
					},
					{
						id: 'tabs',
						pageName: 'Tabs',
						path: '/components/tabs',
						// icon: "edit-icon",
						permissions: {
							view: true,
							edit: true,
						},
						subPages: [],
					},
					{
						id: 'table',
						pageName: 'Table',
						path: '/components/table',
						// icon: "edit-icon",
						permissions: {
							view: true,
							edit: true,
						},
						subPages: [],
					},
					{
						id: 'modal',
						pageName: 'Modal',
						path: '/components/modal',
						// icon: "edit-icon",
						permissions: {
							view: true,
							edit: true,
						},
						subPages: [],
					},
					{
						id: 'datepicker',
						pageName: 'Datepicker',
						path: '/components/datepicker',
						// icon: "edit-icon",
						permissions: {
							view: true,
							edit: true,
						},
						subPages: [],
					},
					{
						id: 'loaders',
						pageName: 'Loaders',
						path: '/components/loaders',
						// icon: "edit-icon",
						permissions: {
							view: true,
							edit: true,
						},
						subPages: [],
					},
					{
						id: 'snackbar',
						pageName: 'Snackbar',
						path: '/components/snackbar',
						// icon: "edit-icon",
						permissions: {
							view: true,
							edit: true,
						},
						subPages: [],
					},
					{
						id: 'svg-color',
						pageName: 'Svg Color',
						path: '/components/svg-color',
						// icon: "edit-icon",
						permissions: {
							view: true,
							edit: true,
						},
						subPages: [],
					},
				],
			},
			{
				id: 'props',
				pageName: 'Props',
				path: '/docs/props',
				icon: DemoNavIconName.SETTINGS,
				permissions: {
					view: true,
					edit: true,
				},
				subPages: [
					{
						id: 'input',
						pageName: 'Input',
						path: '/docs/props/input',
						permissions: {
							view: true,
							edit: true,
						},
						subPages: [],
					},
					{
						id: 'modal',
						pageName: 'Modal',
						path: '/docs/props/modal',
						permissions: {
							view: true,
							edit: true,
						},
						subPages: [],
					},
					{
						id: 'table',
						pageName: 'Table',
						path: '/docs/props/table',
						permissions: {
							view: true,
							edit: true,
						},
						subPages: [],
					},
				],
			},
			{
				id: 'pages',
				pageName: 'Page Templates',
				path: '/page-templates',
				icon: DemoNavIconName.SETTINGS,
				permissions: {
					view: true,
					edit: true,
				},
				subPages: [
					{
						id: '角色權限',
						pageName: '角色權限',
						path: '/page-templates/role',
						// icon: "view-icon",
						permissions: {
							view: true,
							edit: true,
						},
						subPages: [],
					},
					{
						id: '帳號管理',
						pageName: '帳號管理',
						path: '/page-templates/account',
						// icon: "edit-icon",
						permissions: {
							view: true,
							edit: true,
						},
						subPages: [],
					},
					{
						id: '順序下拉排列',
						pageName: '順序下拉排列',
						path: '/page-templates/select-sort',
						permissions: {
							view: true,
							edit: true,
						},
						subPages: [],
					},
					{
						id: 'table checkbox範例',
						pageName: 'table checkbox範例',
						path: '/page-templates/table-checkbox',
						permissions: {
							view: true,
							edit: true,
						},
						subPages: [],
					},
					{
						id: 'Dynamic Table example',
						pageName: '動態表格',
						path: '/page-templates/dynamic-table',
						permissions: {
							view: true,
							edit: true,
						},
						subPages: [],
					},
				],
			},
			{
				id: "api-examples'",
				pageName: 'API Examples',
				path: '/example-api-fetch',
				icon: DemoNavIconName.ALERT,
				permissions: {
					view: true,
					edit: true,
				},
				subPages: [
					{
						id: 'simple-api-fetch',
						pageName: 'Simple API Fetch',
						path: '/example-api-fetch/example-api-page',
						// icon: "view-icon",
						permissions: {
							view: true,
							edit: true,
						},
						subPages: [],
					},
					{
						id: 'api-fetch-with-auth-token',
						pageName: 'API Fetch with Auth Token',
						path: '/example-api-fetch/example-private-api-page',
						// icon: "edit-icon",
						permissions: {
							view: true,
							edit: true,
						},
						subPages: [],
					},
					{
						id: 'api-fetch-with-swr-options',
						pageName: 'API Fetch with SWR Options',
						path: '/example-api-fetch/example-private-api-page-test',
						// icon: "edit-icon",
						permissions: {
							view: true,
							edit: true,
						},
						subPages: [],
					},
					{
						id: 'api-fetch-with-nextJS-SSR',
						pageName: 'API Fetch with SWR Options',
						path: '/example-api-fetch/example-ssr-api',
						// icon: "edit-icon",
						permissions: {
							view: true,
							edit: true,
						},
						subPages: [],
					},
				],
			},
		],
	},
};
