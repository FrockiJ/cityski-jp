import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

import { useAppSelector } from '@/state/store';

/**
 * Determines the user's authentication status to on the frontend.
 *
 * @returns boolean value of the user's authentication status
 */
const useIsAuthorized = () => {
	const accessToken = useAppSelector((state) => state.auth.accessToken);
	const refreshToken = Cookies.get('refresh');
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	useEffect(() => {
		if (accessToken && refreshToken) {
			setIsAuthenticated(true);
		} else {
			setIsAuthenticated(false);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [accessToken]);

	return isAuthenticated;
};

export default useIsAuthorized;
