'use client';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { CreateLineAccount, MemberSignInResponseDTO, ResponseWrapper } from '@repo/shared';
import axios, { isAxiosError } from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';

import Spinner from '@/components/Project/Shared/Common/Spinner';
import { showToast } from '@/components/Project/Utils/Toast';
import { setAuthToken, setUserInfo } from '@/state/slices/authSlice';

// custom type guard to check if result is MemberSignInResponseDTO
function isMemberSignInResponseDTO(result: any): result is MemberSignInResponseDTO {
	return 'accessToken' in result && result.accessToken;
}

function LineAuthenticated() {
	const router = useRouter();
	const dispatch = useDispatch();
	/**
	 * yo michael, just grab the "code" query string here from the url
	 * (memories Ory) and hit my line signin endpoint at:
	 * /api/auth/member/line-signin
	 *
	 * This is an example for you, but you dont have to do everything this way:
	 **/

	const searchParams = useSearchParams();

	useEffect(() => {
		// prevent local storage access on server-side
		if (typeof window === 'undefined') return;

		// code from url query string
		const code = searchParams.get('code');
		// state from url query string, passed over automatically from line-signin api
		const state = searchParams.get('state');
		// state from localStorage, which we stored before using line to sign-in
		const stateLocalStorage = localStorage.getItem('line_auth_state');
		// Get the redirect URL from localStorage instead of search params
		const redirectTo = localStorage.getItem('line_auth_redirect') || '/';

		console.log('After line oauth authenticated, code:', code);

		// check state is still the same
		if (state !== stateLocalStorage) {
			// kick the user from the process
			console.log('State did not persist after sign-in.');
			return;
		}

		// 1. our server's line-signin api to check
		// code is valid and exchange for city-ski tokens.
		async function exchangeTokens() {
			// response either comes back as either:
			// 1. a) member sign-in object (with tokens)
			// 1. b) request to create a line account
			let response: {
				data: ResponseWrapper<MemberSignInResponseDTO | CreateLineAccount>;
			};

			try {
				response = await axios.post(process.env.NEXT_PUBLIC_BACKEND_URL + '/api/auth/member/line-signin', {
					code,
				});
			} catch (err) {
				console.log('Error when attempting to call line sign-in api.');
				if (isAxiosError(err)) {
					// console.log('Error:\n', err.response.data);
					showToast(err.response.data.message, 'error');
					router.push('/login');
				}
				// handle error flow. Redirect? Popup?
				return;
			}
			console.log('response:', response);

			// 2. if authenticated and exists line member exists, login using access tokens
			const { result } = response.data;

			// use simple type guard to check if result is member signed-in type

			if (isMemberSignInResponseDTO(result)) {
				// store tokens and route to home page
				console.log(`accessToken: ${result.refreshToken}\nrefreshToken: ${result.refreshToken}`);
				dispatch(setUserInfo(result.userInfo));
				dispatch(setAuthToken(result.accessToken));
				// set refresh token to local storage
				localStorage.setItem('refresh_token', result.refreshToken);
				localStorage.removeItem('line_auth_redirect');
				router.push(redirectTo);
			} else {
				// 3. member already exists
				// route to line sign-UP flow

				const { status, access_token, id_token } = result;
				if (status !== 'CREATE_ACCOUNT') {
					// stop flow just incase unpredicted status is received
					return;
				}
				console.log(`status: ${status}`);
				console.log(`line token: ${access_token}`);

				// Pass both token types AND redirect to sign up page
				router.push(
					`/login/line-authenticated/sign-up?token=${access_token}&id_token=${id_token}&redirect=${encodeURIComponent(redirectTo)}`,
				);
			}
		}

		exchangeTokens();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div className='h-screen w-full flex items-center justify-center -mt-20'>
			<div className='flex flex-col items-center gap-2'>
				{/* 驗證成功 重新導向中... */}
				<Spinner size={40} stroke={5} speed={0.9} color='black' />
			</div>
		</div>
	);
}

export default LineAuthenticated;
