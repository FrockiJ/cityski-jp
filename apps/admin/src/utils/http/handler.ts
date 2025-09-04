import { GetPermissionResponseDTO, RefreshTokenResponseDTO, ResponseWrapper } from '@repo/shared';
import axios from 'axios';
import Cookies from 'js-cookie';

import { ROUTE } from '@/shared/constants/enums';
import { setAuthToken, setNavList } from '@/state/slices/authSlice';
import { setActiveNav } from '@/state/slices/layoutSlice';
import { setUserDepartments, setUserInfo } from '@/state/slices/userSlice';
import { store } from '@/state/store';
import HttpError from '@/utils/http/classes/HttpError';
import { showToast } from '@/utils/ui/general';

import { BASE_URL } from './config';
import http from './instance';

export const generalErrorHandler = (error: Error) => {
	if (error instanceof HttpError) {
		showToast(`${error.errorResponse.statusCode} ${error.message}`, 'error');
	}
};

export const formSubmitErrorHandler = (error: Error) => {
	if (error instanceof HttpError) {
		showToast(`輸入的數值不符合規則，請確認後再試。`, 'error');
	}
};

// 如果 refreshTokenCookie 存在且有效，則發出請求取得新的 accessToken
export const refreshAccessToken = async () => {
	const refreshTokenCookie = Cookies.get('refresh');
	let newAccessToken = '';

	try {
		const response = await axios
			.create({ baseURL: BASE_URL[process.env.NODE_ENV] })
			.post<ResponseWrapper<RefreshTokenResponseDTO>>('/api/auth/refresh', {
				refreshToken: refreshTokenCookie,
			});

		const { accessToken, expiresIn, refreshExpiresIn, refreshToken } = response.data.result;

		if (accessToken && refreshToken) {
			// set newAccessToken
			newAccessToken = accessToken;

			// store refresh token in cookies
			Cookies.set('refresh', refreshToken, {
				expires: expiresIn / (60 * 60 * 24),
				path: '/',
			});

			// set token valid flag
			if (process.env.NEXT_PUBLIC_TOKEN) {
				Cookies.set(process.env.NEXT_PUBLIC_TOKEN, process.env.NEXT_PUBLIC_TOKEN, {
					expires: refreshExpiresIn / (60 * 60 * 24),
				});
			}

			// update accessToken in redux state to be stored in memory
			store.dispatch(setAuthToken(accessToken));

			// update activeNav in redux state to be stored in memory
			store.dispatch(
				setActiveNav({
					activeParent: ROUTE.DASHBOARD,
					activeCurrentNav: ROUTE.DASHBOARD,
				}),
			);

			// use departmentId from localStorage to get use's info
			const departmentId = localStorage.getItem('departmentId');

			if (departmentId) {
				const responseUserPermission = await http.post<ResponseWrapper<GetPermissionResponseDTO>>(
					`/api/auth/user-permission`,
					{
						departmentId,
					},
				);

				// update userInfo, departments, menus in redux state to be stored in memory
				store.dispatch(setUserInfo(responseUserPermission.result.userInfo));
				store.dispatch(setUserDepartments(responseUserPermission.result.departments));
				store.dispatch(setNavList(responseUserPermission.result.menus));
			}
		}
	} catch (err) {
		console.error('Error while requesting new accessToken:', err);
	}

	return newAccessToken;
};
