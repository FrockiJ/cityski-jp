import React from 'react';

import { Permissions } from '@/shared/types/auth';
import { useAppSelector } from '@/state/store';

/**
 * Components can dynamically gain permissions. this HOC based on WithPermissions
 * Notice to extends PermissionsProps interface to components props
 * @template TProps - component's generic type
 * @param WrappedComponent - any components want to gain permissions
 * @param toHide - Hide when no permissions
 * @returns
 */

const withDynamicPermissions = <TProps,>(
	WrappedComponent: React.ComponentType<TProps & { permissions?: Permissions }>,
	toHide?: boolean,
) => {
	const MyComponent = (props: any) => {
		const permissions = useAppSelector((state) => state.auth.permissions);
		// const newProps = {...props , ...(permissions && { permissions: permissions })}
		// 無權限並且想隱藏時
		if (!permissions?.edit && toHide) {
			return null;
		}
		return <WrappedComponent {...props} {...(permissions && { permissions: permissions })} />;
	};

	return MyComponent;
};
export default withDynamicPermissions;
