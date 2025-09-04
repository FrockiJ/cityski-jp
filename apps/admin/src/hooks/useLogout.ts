import { HttpStatusCode } from '@repo/shared';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';

import { ROUTE } from '@/shared/constants/enums';
import { setAuthToken } from '@/state/slices/authSlice';
import { setActiveNav } from '@/state/slices/layoutSlice';
import { resetUserState } from '@/state/slices/userSlice';
import { useAppDispatch } from '@/state/store';
import api from '@/utils/http/api';
import { generalErrorHandler } from '@/utils/http/handler';
import { useLazyRequest } from '@/utils/http/hooks';

/**
 * Handles all logout procedures in one compact function.
 */
const useLogout = () => {
	const dispatch = useAppDispatch();
	const router = useRouter();

	// --- API ---
	const [signOut] = useLazyRequest(api.signOut, {
		onError: generalErrorHandler,
	});

	const logout = async () => {
		const { statusCode } = await signOut();

		if (statusCode === HttpStatusCode.OK) {
			// clears refreshToken in cookies
			Cookies.remove('refresh');

			// clears valid token flag
			if (process.env.NEXT_PUBLIC_TOKEN) {
				Cookies.remove(process.env.NEXT_PUBLIC_TOKEN);
			}

			// clears accessToken in memory
			dispatch(setAuthToken(''));

			// clears nav in memory
			dispatch(
				setActiveNav({
					activeParent: '',
					activeCurrentNav: '',
				}),
			);

			// clears useInfo in memory
			dispatch(resetUserState());
		}
	};

	const purgeUserAuth = () => {
		// re-routes to login
		router.push(ROUTE.LOGIN);

		// clears refreshToken in cookies
		Cookies.remove('refresh');

		// clears valid token flag
		if (process.env.NEXT_PUBLIC_TOKEN) {
			Cookies.remove(process.env.NEXT_PUBLIC_TOKEN);
		}

		// clears accessToken in memory
		dispatch(setAuthToken(''));

		// clears nav in memory
		dispatch(
			setActiveNav({
				activeParent: '',
				activeCurrentNav: '',
			}),
		);

		// clears useInfo in memory
		dispatch(resetUserState());
	};

	return { logout, purgeUserAuth };
};

export default useLogout;
