'use client';
import React, { Suspense, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import axios from 'axios';
import { usePathname } from 'next/navigation';

import Loading from '@/app/loading';
import Header from '@/components/Layout/Header';
import ScrollBody from '@/components/Layout/ScrollBody';
import { setAuthToken, setUserInfo } from '@/state/slices/authSlice';

import Footer from './Footer';

const MainLayout = ({ children }) => {
	const pathname = usePathname();
	const dispatch = useDispatch();
	const [isAuthChecked, setIsAuthChecked] = useState(false);

	useEffect(() => {
		const refreshAccessToken = async () => {
			console.log('Checking refresh token...');
			const refreshToken = localStorage.getItem('refresh_token');

			if (!refreshToken) {
				console.log('No refresh token found');
				setIsAuthChecked(true);
				return;
			}

			try {
				console.log('Calling refresh token API...');
				const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/refresh`, { refreshToken });

				console.log('API Response:', response.data);
				const { result } = response.data;
				const { accessToken, refreshToken: newRefreshToken, userInfo } = result;

				if (accessToken) {
					console.log('Setting new access token...', { accessToken });
					dispatch(setAuthToken(accessToken));
					dispatch(setUserInfo(userInfo));

					if (newRefreshToken) {
						localStorage.setItem('refresh_token', newRefreshToken);
					}
				} else {
					console.log('Invalid response data - missing access token');
					localStorage.removeItem('refresh_token');
					dispatch(setAuthToken(''));
					dispatch(setUserInfo(null));
				}
			} catch (error) {
				console.error('Error refreshing token:', error);
				localStorage.removeItem('refresh_token');
				dispatch(setAuthToken(''));
				dispatch(setUserInfo(null));
			} finally {
				console.log('Auth check complete');
				setIsAuthChecked(true);
			}
		};

		refreshAccessToken();
	}, [dispatch]);

	useEffect(() => {
		const simpleBarEl = document.querySelector('.simplebar-content-wrapper');
		if (simpleBarEl) {
			simpleBarEl.scrollTo({ top: 0 });
		}
	}, [pathname]);

	if (!isAuthChecked) {
		console.log('Still checking auth...');
		return <Loading />;
	}

	console.log('Rendering main layout');
	return (
		<Suspense fallback={<Loading />}>
			<ScrollBody>
				<Header />
				<ToastContainer autoClose={3000} closeButton={false} className='custom-toast-container' />
				<div className='flex-grow min-h-screen max-xs:min-h-0'>{children}</div>
				<Footer />
			</ScrollBody>
		</Suspense>
	);
};

export default MainLayout;
