'use client';

import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';

import { BlurFade } from '@/components/Effects/BlurFade';
import RegisterForm from '@/components/Project/Register/RegisterForm';
import { selectUserInfo } from '@/state/slices/authSlice';

const RegisterPage = () => {
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
					<BlurFade className='flex flex-col w-[49%] max-xs:ml-0 max-xs:w-full max-xs:hidden' noGrow>
						<img
							loading='lazy'
							src='/image/login/login_image_ski.webp'
							alt='Registration illustration'
							className='object-contain w-[452px] mt-[6px] aspect-[0.77] max-xs:mt-10 max-xs:max-w-full'
						/>
					</BlurFade>
					<div className='flex flex-col w-[335px] max-xs:ml-0 max-xs:w-[89vw]'>
						<RegisterForm />
					</div>
				</div>
			</main>
		</div>
	);
};

export default RegisterPage;
