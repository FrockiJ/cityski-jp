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
 * Route Guard Component
 *
 * This component ensures proper access control for routes within the application.
 *
 * Goals:
 * - Redirect users to the login page if they are not authorized and attempt to access a restricted route.
 * - Redirect logged-in users away from non-authenticated routes (e.g., login) to the default dashboard page or previous page.
 * - Automatically handle token renewal and default page redirection for better user experience.
 *
 * @param {RouteGuardProps} props - Component properties.
 * @param {React.ReactNode} props.children - The portion of the application protected by the route guard.
 * @returns {JSX.Element} The guarded children elements.
 */
const RouteGuard = ({ children }: RouteGuardProps): JSX.Element => {
	const router = useRouter();
	const isAuthorized = useIsAuthorized();
	const userInfo = useAppSelector((state) => state.user.userInfo);

	// Check if the current route is a non-authenticated route
	const { isExcludeAuthPath } = useExcludeAuthPath();

	// Automatically handle token renewal
	useRenewToken();

	useUpdateEffect(() => {
		const action = async () => {
			if (!userInfo && !isAuthorized && !isExcludeAuthPath && router.pathname !== ROUTE.NOT_FOUND_404) {
				// Redirect unauthorized users trying to access restricted pages
				await router.push(ROUTE.LOGIN);
			}

			if (userInfo && isAuthorized && !isExcludeAuthPath && router.pathname === ROUTE.ROOT) {
				await router.push(ROUTE.DASHBOARD);
			}
		};

		action();
	}, [isAuthorized, isExcludeAuthPath, router, userInfo]);

	return <>{children}</>;
};

export default RouteGuard;
