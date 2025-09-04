import { useRouter } from 'next/router';

import { ROUTE } from '@/shared/constants/enums';

/**
 * Custom hook to check if the current path is a non-authenticated route.
 *
 * This hook helps determine if the user is on a path that does not require authentication.
 * It returns a boolean indicating if the current route matches any of the specified
 * non-authentication routes.
 *
 * @returns {Object} An object containing:
 * - `isExcludeAuthPath` {boolean}: Indicates if the current route is one of the non-authenticated routes.
 * - `excludeAuthPaths` {ROUTE[]}: An array of all routes considered as non-authenticated paths.
 */
const useExcludeAuthPath = () => {
	const router = useRouter();

	// for free to add any non-authenticated route
	const excludeAuthPaths = [ROUTE.LOGIN, ROUTE.RESET_PASSWORD];
	const isExcludeAuthPath = excludeAuthPaths.includes(router.pathname as ROUTE);

	return { isExcludeAuthPath, excludeAuthPaths };
};

export default useExcludeAuthPath;
