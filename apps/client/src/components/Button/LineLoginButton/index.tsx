function LineLoginButton() {
	// generates a random base-36 string (allows for both numbers and letters)
	// cut the head to the end (leaves out the 0 at the start)
	// In summary: it creates a random 14 digit string with numbers and letters.
	const generateRandomState = () => Math.random().toString(36).substring(2, 15);
	const state = generateRandomState();

	// store the state for preventing CSF attacks.
	if (typeof window !== 'undefined') {
		localStorage.setItem('line_auth_state', state);
	}

	const handleLineLogin = () => {
		// NOTE:
		// 1. redirect_uri MUST MATCH that set on the LINE developer console.
		// 2. Scope MUST have profile AND email
		const oauthURL = `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=${process.env.NEXT_PUBLIC_LINE_CHANNEL_ID}&redirect_uri=${encodeURIComponent(process.env.NEXT_PUBLIC_LINE_REDIRECT_URI)}&state=${state}&scope=openid%20profile%20email`;

		console.log('oauthURL', oauthURL);
		window.location.href = oauthURL;
	};

	return (
		<div>
			<p> Example for Client Line OAuth + Member Creation Flow</p>

			<div className='h-screen flex justify-center items-center'>
				<button
					className='w-[300px] h-[100px] border-none rounded-lg text-4xl bg-green-600 text-white cursor-pointer'
					onClick={handleLineLogin}
				>
					Login with LINE
				</button>
			</div>
		</div>
	);
}

export default LineLoginButton;
