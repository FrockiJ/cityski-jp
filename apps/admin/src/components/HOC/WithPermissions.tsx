import React from 'react';
import { useRouter } from 'next/router';

import { navData } from '@/shared/data/nav-list-data';
import { Permissions } from '@/shared/types/auth';
import { NavWithPermissionModel } from '@/shared/types/roleModel';
import { setPermissions } from '@/state/slices/authSlice';
import { useAppDispatch } from '@/state/store';

/**
 * Prefer using the index page component to gain permissions.
 * Notice to extends PermissionsProps interface to components props
 * @template TProps - component's generic type
 * @param WrappedComponent - any components want to gain permissions
 * @returns
 */

const WithPermissions = <TProps,>(WrappedComponent: React.ComponentType<TProps & { permissions?: Permissions }>) => {
	const MyComponent = (props: any) => {
		const dispatch = useAppDispatch();
		const navList = navData.result_data.pages;
		const router = useRouter();
		const currentPath = router.pathname;
		const rootPath = '/' + currentPath.split('/')[1];
		const rootData = navList.find((page) => page.path === rootPath); // 直接先將最外層找出來減少遞迴次數
		let permissions: Permissions | undefined = undefined;

		// 遞迴找對的頁面權限
		const searchPath = (data: NavWithPermissionModel) => {
			if (data.path === currentPath) {
				permissions = data.permissions;
				dispatch(setPermissions(permissions));
				return;
			}
			if (data.subPages.length > 0) {
				data.subPages.forEach((subPage) => {
					searchPath(subPage);
				});
			} else {
				return;
			}
		};
		if (rootData) searchPath(rootData);

		// 無權限時
		if (!permissions) {
			dispatch(setPermissions(undefined));
			return 'Permission Denied';
		}

		return <WrappedComponent {...props} permissions={permissions} />;
	};

	return MyComponent;
};
export default WithPermissions;
