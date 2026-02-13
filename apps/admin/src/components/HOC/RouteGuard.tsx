import { MenuDTO } from '@repo/shared';
import { useRouter } from 'next/router';

import useExcludeAuthPath from '@/hooks/useExcludeAuthPath';
import useIsAuthorized from '@/hooks/useIsAuthorized';
import useRenewToken from '@/hooks/useRenewToken';
import { useUpdateEffect } from '@/hooks/useUpdateEffect';
import { ROUTE } from '@/shared/constants/enums';
import { useAppSelector } from '@/state/store';

interface RouteGuardProps {
	children: React.ReactNode;
}

/**
 * Check if the current path is allowed based on the menu list
 * @param menus - The menu list from API
 * @param currentPath - The current router pathname
 * @returns boolean - Whether the path is allowed
 */
const isPathAllowed = (menus: MenuDTO[], currentPath: string): boolean => {
	for (const menu of menus) {
		// Check if current path matches or starts with menu path
		if (menu.path && (currentPath === menu.path || currentPath.startsWith(menu.path + '/'))) {
			return true;
		}
		// Recursively check subPages
		if (menu.subPages && menu.subPages.length > 0) {
			if (isPathAllowed(menu.subPages, currentPath)) {
				return true;
			}
		}
	}
	return false;
};

/**
 * Route Guard Component
 *
 * This component ensures proper access control for routes within the application.
 *
 * Goals:
 * - Redirect users to the login page if they are not authorized and attempt to access a restricted route.
 * - Redirect logged-in users away from non-authenticated routes (e.g., login) to the default dashboard page or previous page.
 * - Automatically handle token renewal and default page redirection for better user experience.
 * - Check if the user has permission to access the current page based on the menu list.
 *
 * @param {RouteGuardProps} props - Component properties.
 * @param {React.ReactNode} props.children - The portion of the application protected by the route guard.
 * @returns {JSX.Element} The guarded children elements.
 */
const RouteGuard = ({ children }: RouteGuardProps): JSX.Element => {
	const router = useRouter();
	const isAuthorized = useIsAuthorized();
	const userInfo = useAppSelector((state) => state.user.userInfo);
	const navList = useAppSelector((state) => state.auth.navList);

	// Check if the current route is a non-authenticated route
	const { isExcludeAuthPath } = useExcludeAuthPath();

	// Automatically handle token renewal
	useRenewToken();

	useUpdateEffect(() => {
		const action = async () => {
			if (!userInfo && !isAuthorized && !isExcludeAuthPath && router.pathname !== ROUTE.NOT_FOUND_404) {
				// Redirect unauthorized users trying to access restricted pages
				await router.push(ROUTE.LOGIN);
				return;
			}

			if (userInfo && isAuthorized && !isExcludeAuthPath && router.pathname === ROUTE.ROOT) {
				await router.push(ROUTE.DASHBOARD);
				return;
			}

			// Check menu-based permission for authenticated users
			if (userInfo && isAuthorized && !isExcludeAuthPath && navList.length > 0) {
				const currentPath = router.pathname;
				// Skip permission check for dashboard and 404 pages
				if (currentPath !== ROUTE.DASHBOARD && currentPath !== ROUTE.NOT_FOUND_404) {
					if (!isPathAllowed(navList, currentPath)) {
						// User doesn't have permission to access this page
						await router.push(ROUTE.DASHBOARD);
					}
				}
			}
		};

		action();
	}, [isAuthorized, isExcludeAuthPath, router, userInfo, navList]);

	return <>{children}</>;
};

export default RouteGuard;
