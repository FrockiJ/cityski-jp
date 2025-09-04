'use client';

import React from 'react';

const ConnectAccountButton = () => {
	// generates a random base-36 string (allows for both numbers and letters)
	// cut the head to the end (leaves out the 0 at the start)
	// In summary: it creates a random 14 digit string with numbers and letters.
	const generateRandomState = () => Math.random().toString(36).substring(2, 15);
	const state = generateRandomState();

	// store the state for preventing CSF attacks.
	if (typeof window !== 'undefined') {
		localStorage.setItem('line_auth_state', state);
	}

	// console.log('ENV check:', {
	// 	channelId: process.env.NEXT_PUBLIC_LINE_CHANNEL_ID,
	// 	redirectUri: process.env.NEXT_PUBLIC_LINE_REDIRECT_URI,
	// });

	const handleLineLogin = () => {
		// Store the redirect URL before initiating LINE login
		const redirectTo = '/member?section=personal-info&checkLineOa=true';
		localStorage.setItem('connected', 'true');
		localStorage.setItem('line_auth_redirect', redirectTo);

		// NOTE:
		// 1. redirect_uri MUST MATCH that set on the LINE developer console.
		// 2. Scope MUST have profile AND email
		const oauthURL = `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=${process.env.NEXT_PUBLIC_LINE_CHANNEL_ID}&redirect_uri=${encodeURIComponent(process.env.NEXT_PUBLIC_LINE_REDIRECT_URI)}&state=${state}&scope=openid%20profile%20email`;

		console.log('oauthURL', oauthURL);
		window.location.href = oauthURL;
	};

	return (
		<button
			className='flex overflow-hidden gap-2 justify-center items-center px-5 py-2 w-[162px] h-[40px] text-sm font-bold text-white bg-[#1AC460] hover:bg-[#159C4D] rounded-lg max-xs:px-5 transition-all duration-200 select-none max-xs:w-full'
			onClick={handleLineLogin}
		>
			<img
				loading='lazy'
				src='image/line/line-white-sm.svg'
				alt=''
				className='object-contain shrink-0 self-stretch my-auto w-6 aspect-square'
			/>
			<span className='self-stretch my-auto font-medium'>
				連結<span className='font-bold mx-[2px]'>LINE</span>帳號
			</span>
		</button>
	);
};

export default ConnectAccountButton;
