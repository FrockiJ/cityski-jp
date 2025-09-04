'use client';

import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';

import { selectToken } from '@/state/slices/authSlice';

export function AuthGuard<P extends object>(Component: React.ComponentType<P>) {
	return function WithAuthComponent(props: P) {
		const router = useRouter();
		const authToken = useSelector(selectToken);

		useEffect(() => {
			if (!authToken) {
				const currentPath = window.location.pathname;
				const isLoggingOut = sessionStorage.getItem('isLoggingOut');

				if (isLoggingOut) {
					sessionStorage.removeItem('isLoggingOut');
					router.replace('/login');
				} else {
					router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
				}
			}
		}, [authToken, router]);

		if (!authToken) {
			return null;
		}

		return <Component {...props} />;
	};
}
