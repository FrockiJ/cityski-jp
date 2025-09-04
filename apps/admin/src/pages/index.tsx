import { useEffect } from 'react';
import { useRouter } from 'next/router';

import { useAppSelector } from '@/state/store';

const Index = () => {
	const userInfo = useAppSelector((state) => state.user.userInfo);
	const router = useRouter();

	useEffect(() => {
		if (!userInfo) {
			router.push('/login');
		} else {
			router.push('/dashboard');
		}
	}, [userInfo, router]);

	// Need to return something while the redirect happens
	return null;
};

export default Index;
