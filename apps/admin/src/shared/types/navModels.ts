import { DemoNavIconName } from '@/shared/constants/enums';

export type AdminNavModel = {
	name: string;
	path: string;
	icon?: DemoNavIconName;
	subNav?: SubNav[];
};

type SubNav = {
	name: string;
	path: string;
};
