'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';

import Button from '../Shared/Common/Button';

type Props = {};

const EnableLineLoginButton = (props: Props) => {
	const searchParams = useSearchParams();

	// generates a random base-36 string (allows for both numbers and letters)
	// cut the head to the end (leaves out the 0 at the start)
	// In summary: it creates a random 14 digit string with numbers and letters.
	const generateRandomState = () => Math.random().toString(36).substring(2, 15);
	const state = generateRandomState();

	// store the state for preventing CSF attacks.
	if (typeof window !== 'undefined') {
		localStorage.setItem('line_auth_state', state);
	}

	console.log('ENV check:', {
		channelId: process.env.NEXT_PUBLIC_LINE_CHANNEL_ID,
		redirectUri: process.env.NEXT_PUBLIC_LINE_REDIRECT_URI,
	});

	const handleLineLogin = () => {
		// Store the redirect URL before initiating LINE login
		const redirectTo = searchParams.get('redirect') || '/';
		localStorage.setItem('line_auth_redirect', redirectTo);

		// NOTE:
		// 1. redirect_uri MUST MATCH that set on the LINE developer console.
		// 2. Scope MUST have profile AND email
		const oauthURL = `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=${process.env.NEXT_PUBLIC_LINE_CHANNEL_ID}&redirect_uri=${encodeURIComponent(process.env.NEXT_PUBLIC_LINE_REDIRECT_URI)}&state=${state}&scope=openid%20profile%20email`;

		console.log('oauthURL', oauthURL);
		window.location.href = oauthURL;
	};

	return (
		<Button className='w-full h-12' onClick={handleLineLogin}>
			立即連結
		</Button>
	);
};

export default EnableLineLoginButton;
