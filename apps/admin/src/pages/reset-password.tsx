import { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { DialogAction, HttpStatusCode, MessageType } from '@repo/shared';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';

import CoreButton from '@/components/Common/CIBase/CoreButton';
import CoreResetPasswordForm from '@/components/Common/CIBase/CoreForm/CoreResetPasswordForm';
import CoreLoaders from '@/components/Common/CIBase/CoreLoaders';
import Logo from '@/components/Layout/Sidebar/Logo';
import ForgetPasswordModal from '@/components/Project/shared/ForgetPasswordModal';
import { useAnimations } from '@/hooks/useAnimations';
import useModalProvider from '@/hooks/useModalProvider';
import checkTokenFailedSVG from '@/public/icons/check-token-failed.svg';
import { ROUTE } from '@/shared/constants/enums';
import api from '@/utils/http/api';
import { generalErrorHandler } from '@/utils/http/handler';
import { useLazyRequest } from '@/utils/http/hooks';

const ResetPassword = () => {
	const searchParams = useSearchParams();
	const { animate, fadeIn } = useAnimations({ delay: 200 });
	const modal = useModalProvider();
	const router = useRouter();
	const AnimatedBox = animate(Box);
	const token = searchParams.get('token');
	const [isTokenValid, setIsTokenValid] = useState(false);

	// --- API ---

	const [checkResetToken, { loading: checkResetTokenLoading }] = useLazyRequest(api.checkResetToken);

	const [forgotPassword, { loading: forgotPasswordLoading }] = useLazyRequest(api.forgotPassword, {
		onError: generalErrorHandler,
	});

	// --- FUNCTIONS ---

	const handleForgetPassword = async () => {
		if (!token) return;

		const { statusCode } = await forgotPassword({
			token,
			eitherEmailOrToken: true,
		});

		if (statusCode === HttpStatusCode.OK) {
			modal.openMessageModal({
				type: MessageType.INFO,
				title: '請重設密碼',
				content: `請至 Email 電子信箱，重新設定密碼後再登入平台`,
				onClose: (action) => {
					if (action === DialogAction.CONFIRM) {
						router.push(ROUTE.LOGIN);
					}
					close?.();
				},
			});
		} else {
			modal.openModal({
				title: `重新寄送連結`,
				width: 480,
				noEscAndBackdrop: true,
				children: <ForgetPasswordModal />,
			});
		}
	};

	// --- EFFECT ---

	useEffect(() => {
		async function fetchData() {
			if (token) {
				await checkResetToken(token)
					.then(({ statusCode }) => {
						if (statusCode === HttpStatusCode.OK) {
							setIsTokenValid(true);
						} else {
							setIsTokenValid(false);
						}
					})
					.catch(() => console.log('checkResetToken error'));
			}
		}

		if (token) fetchData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [token]);

	const isLoading = checkResetTokenLoading || forgotPasswordLoading;

	return (
		<AnimatedBox style={fadeIn}>
			{isLoading && <CoreLoaders hasOverlay />}
			<Box sx={{ position: 'absolute', top: 65, left: 56 }}>
				<Logo />
			</Box>
			<Box
				sx={{
					width: 480,
					position: 'absolute',
					top: '50%',
					left: '50%',
					transform: 'translate(-50%, -50%)',
				}}
			>
				{isTokenValid ? (
					<CoreResetPasswordForm token={token} />
				) : (
					<Box textAlign='center'>
						<Image
							unoptimized
							priority
							width={96}
							height={96}
							alt='token_failed'
							src={checkTokenFailedSVG.src}
							style={{
								objectFit: 'contain',
								maxWidth: '100%',
								maxHeight: '100%',
								width: 96,
								height: 96,
							}}
						/>
						<Typography variant='h4' sx={{ mt: 2, mb: 2 }}>
							重設密碼連結失效
						</Typography>
						<Typography variant='body1' sx={{ color: 'text.secondary', mb: 5 }}>
							{token
								? '此連結已經失效，請點擊「重新寄送連結」，進行重新設定密碼'
								: 'Token 已經遺失，請點擊「回到首頁」，進行忘記密碼動作'}
						</Typography>
						<CoreButton
							variant='contained'
							label={token ? '重新寄送連結' : '回到首頁'}
							onClick={token ? handleForgetPassword : () => router.push(ROUTE.LOGIN)}
						/>
					</Box>
				)}
			</Box>
		</AnimatedBox>
	);
};

export default ResetPassword;
