'use client';

import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';

import Spinner from '@/components/Project/Shared/Common/Spinner';
import { showToast } from '@/components/Project/Utils/Toast';
import { setAuthToken, setUserInfo } from '@/state/slices/authSlice';

export default function VerifyAccount() {
	const router = useRouter();
	const dispatch = useDispatch();
	const searchParams = useSearchParams();
	const [verifying, setVerifying] = useState(true);

	useEffect(() => {
		const verifyEmail = async () => {
			try {
				const token = searchParams.get('token');
				if (!token) {
					showToast('驗證連結無效', 'error');
					router.push('/login');
					return;
				}

				const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/verify-email?token=${token}`);
				const { accessToken, refreshToken, userInfo } = response.data.result;

				// Store tokens and user info
				dispatch(setAuthToken(accessToken));
				dispatch(setUserInfo(userInfo));
				localStorage.setItem('refresh_token', refreshToken);

				showToast('信箱驗證成功！', 'success');
				router.push('/');
				// eslint-disable-next-line unused-imports/no-unused-vars
			} catch (error) {
				showToast('驗證失敗，請重新註冊', 'error');
				router.push('/register');
			} finally {
				setVerifying(false);
			}
		};

		verifyEmail();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div className='h-screen w-full flex items-center justify-center'>
			{verifying ? (
				<div className='flex flex-col items-center gap-4'>
					<Spinner />
					<p>驗證中...</p>
				</div>
			) : null}
		</div>
	);
}
