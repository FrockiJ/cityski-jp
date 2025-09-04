'use client';

import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';

import { BlurFade } from '@/components/Effects/BlurFade';
import LoginEmail from '@/components/Project/Login/LoginEmail';
import LoginForm from '@/components/Project/Login/LoginForm';
import { selectUserInfo } from '@/state/slices/authSlice';

const LoginPage = () => {
	const [showEmailLogin, setShowEmailLogin] = useState(false);
	const router = useRouter();
	const userInfo = useSelector(selectUserInfo);

	useEffect(() => {
		if (userInfo) {
			router.replace(`/`);
		}
	}, [userInfo, router]);

	return (
		<div className='flex overflow-hidden flex-col bg-white'>
			<main className='self-center mt-24 max-w-full max-xs:mt-10'>
				<div className='flex gap-[100px] w-[927px] max-xs:flex-col'>
					<BlurFade className='flex flex-col w-[49%] max-xs:hidden' noGrow>
						<img
							loading='lazy'
							src='/image/login/login_image_sb.webp'
							alt='Login page illustration'
							className='object-contain aspect-[0.77] mt-[6px] max-xs:mt-10 max-xs:max-w-full w-[452px] h-[588px]'
						/>
					</BlurFade>
					<div className='flex flex-col w-[335px] max-xs:ml-0 max-xs:w-[89vw]'>
						{showEmailLogin ? <LoginEmail /> : <LoginForm onEmailClick={() => setShowEmailLogin(true)} />}
					</div>
				</div>
			</main>
		</div>
	);
};

export default LoginPage;
