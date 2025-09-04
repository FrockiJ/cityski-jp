import { useEffect } from 'react';
import { GetPermissionResponseDTO, HttpStatusCode, RefreshTokenResponseDTO, ResponseWrapper } from '@repo/shared';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';

import useExcludeAuthPath from '@/hooks/useExcludeAuthPath';
import useLogout from '@/hooks/useLogout';
import { ROUTE } from '@/shared/constants/enums';
import { setAuthToken, setNavList } from '@/state/slices/authSlice';
import { setActiveNav, setLayoutTransition } from '@/state/slices/layoutSlice';
import { setUserDepartments, setUserInfo } from '@/state/slices/userSlice';
import { useAppDispatch } from '@/state/store';
import http from '@/utils/http/instance';

/**
 * Helps acquire a new refresh and accessToken pair by accessing
 * our global context state and retrieving the accessToken.
 * @returns A function that retrieves a new access token with the old refreshToken
 */

const useRenewToken = () => {
	const dispatch = useAppDispatch();
	const router = useRouter();
	const { purgeUserAuth } = useLogout();
	const refreshToken = Cookies.get('refresh');
	const { isExcludeAuthPath } = useExcludeAuthPath();

	// 處理網頁 reload 時，判斷 cookies 是否保留 refreshToken 及需要 auth 的頁面
	// 進一步 call API 重新取得 accessToken、refreshToken
	useEffect(() => {
		if (refreshToken && !isExcludeAuthPath) {
			const refresh = async () => {
				try {
					// 因無權限關係導致跑版，打開 TransitionOverlay 覆蓋
					dispatch(setLayoutTransition(true));
					const response = await http.post<ResponseWrapper<RefreshTokenResponseDTO>>('/api/auth/refresh', {
						refreshToken,
					});

					if (response.statusCode === HttpStatusCode.OK) {
						// store refresh token in cookies from response
						Cookies.set('refresh', response.result.refreshToken, {
							expires: response.result.expiresIn / (60 * 60 * 24),
							path: ROUTE.ROOT,
						});

						// set token valid flag
						if (process.env.NEXT_PUBLIC_TOKEN) {
							Cookies.set(process.env.NEXT_PUBLIC_TOKEN, process.env.NEXT_PUBLIC_TOKEN, {
								expires: response.result.refreshExpiresIn / (60 * 60 * 24),
							});
						}

						// update accessToken in redux state to be stored in memory
						dispatch(setAuthToken(response.result.accessToken));

						// update activeNav in redux state to be stored in memory
						dispatch(
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
							dispatch(setUserInfo(responseUserPermission.result.userInfo));
							dispatch(setUserDepartments(responseUserPermission.result.departments));
							dispatch(setNavList(responseUserPermission.result.menus));
						}

						await router.push(router.pathname);
						dispatch(setLayoutTransition(false));
					}
				} catch (error) {
					console.error('an occurred error in requesting new access token', error);

					// 如果 refreshToken 有值但失效，則手動清除 user auth 相關資訊
					purgeUserAuth();

					// 因無權限關係導致跑版，關閉 TransitionOverlay 覆蓋
					dispatch(setLayoutTransition(false));
					return;
				}
			};

			refresh();
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
};

export default useRenewToken;
