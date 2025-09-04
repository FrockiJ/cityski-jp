import { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { DialogAction, HttpStatusCode, MessageType } from '@repo/shared';
import { Form, Formik } from 'formik';
import Image from 'next/image';
import { useRouter } from 'next/router';
import * as Yup from 'yup';

import CoreButton from '@/CIBase/CoreButton';
import CoreLoaders from '@/CIBase/CoreLoaders';
import FormikInput from '@/CIBase/Formik/FormikInput';
import ForgetPasswordModal from '@/components/Project/shared/ForgetPasswordModal';
import useModalProvider from '@/hooks/useModalProvider';
import checkTokenFailedSVG from '@/public/icons/check-token-failed.svg';
import checkTokenSuccessSVG from '@/public/icons/check-token-success.svg';
import { ROUTE } from '@/shared/constants/enums';
import api from '@/utils/http/api';
import { generalErrorHandler } from '@/utils/http/handler';
import { useLazyRequest } from '@/utils/http/hooks';

enum LAYOUT_TYPE {
	FORM = 'FORM',
	SUCCESS = 'SUCCESS',
	FAILED = 'FAILED',
}

interface InitialValuesProps {
	newPassword: string;
	repeatNewPassword: string;
}

const CoreResetPasswordForm = ({ token }: { token: string | null }) => {
	const router = useRouter();
	const modal = useModalProvider();
	const [layoutType, setLayoutType] = useState<LAYOUT_TYPE>(LAYOUT_TYPE.FORM);

	// --- API ---

	const [updatePasswordByForgot, { loading: updatePasswordByForgotLoading }] = useLazyRequest(
		api.updatePasswordByForgot,
	);

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

	// --- FORMIK ---

	const validationSchema = Yup.object().shape({
		newPassword: Yup.string()
			.min(8, '密碼至少8位數')
			.max(16, '密碼最多16位數')
			.matches(/[0-9]/, '密碼需包含一個數字')
			.matches(/[A-Z]/, '密碼需包含一個大寫英文字母')
			.required('必填'),
		repeatNewPassword: Yup.string()
			.oneOf([Yup.ref('newPassword'), undefined], '新密碼與新密碼驗證不相同')
			.required('必填'),
	});

	const initialValues: InitialValuesProps = {
		newPassword: '',
		repeatNewPassword: '',
	};

	const handleFormSubmit = async (values: InitialValuesProps) => {
		if (!token) return;
		const { newPassword, repeatNewPassword } = values;

		await updatePasswordByForgot({
			newPassword,
			repeatNewPassword,
			token,
		})
			.then(({ statusCode }) => {
				if (statusCode === HttpStatusCode.OK) {
					setLayoutType(LAYOUT_TYPE.SUCCESS);
				} else {
					setLayoutType(LAYOUT_TYPE.FAILED);
				}
			})
			.catch(() => setLayoutType(LAYOUT_TYPE.FAILED));
	};

	const isLoading = updatePasswordByForgotLoading || forgotPasswordLoading;

	switch (layoutType) {
		case LAYOUT_TYPE.FORM:
			return (
				<Formik
					enableReinitialize
					initialValues={initialValues}
					validationSchema={validationSchema}
					onSubmit={handleFormSubmit}
				>
					{({ isSubmitting }) => (
						<Form autoComplete='off'>
							{isLoading && <CoreLoaders hasOverlay />}
							<Typography variant='h4'>重設密碼</Typography>
							<Typography variant='body1' sx={{ mt: 1, mb: 5, color: 'text.secondary' }}>
								請輸入您的新密碼
							</Typography>
							<FormikInput
								title='新密碼'
								placeholder='輸入'
								name='newPassword'
								size='medium'
								type='password'
								width='100%'
								wrapperSxProps={{ margin: '0 0 32px 0' }}
								helperText='密碼至少8位數，要包含一個大寫英文字母與一個數字'
							/>
							<FormikInput
								title='新密碼驗證'
								placeholder='輸入'
								name='repeatNewPassword'
								size='medium'
								type='password'
								width='100%'
								wrapperSxProps={{ margin: '0 0 32px 0' }}
							/>
							<CoreButton
								color='primary'
								variant='contained'
								type='submit'
								label='重設密碼'
								fullWidth
								// margin='20px 0 0 0'
								size='large'
								isSubmitting={isSubmitting}
							/>
						</Form>
					)}
				</Formik>
			);

		case LAYOUT_TYPE.SUCCESS:
			return (
				<Box textAlign='center'>
					<Image
						unoptimized
						priority
						width={96}
						height={96}
						alt='token_success'
						src={checkTokenSuccessSVG.src}
						style={{
							objectFit: 'contain',
							maxWidth: '100%',
							maxHeight: '100%',
							width: 96,
							height: 96,
						}}
					/>
					<Typography variant='h4' sx={{ mt: 2, mb: 2 }}>
						重設密碼成功
					</Typography>
					<Typography variant='body1' sx={{ color: 'text.secondary', mb: 5 }}>
						請回到登入頁面，以新密碼登入平台
					</Typography>
					<CoreButton variant='contained' label='前往登入頁面' onClick={() => router.push(ROUTE.ROOT)} />
				</Box>
			);
		case LAYOUT_TYPE.FAILED:
			return (
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
						此連結已經失效，請點擊「重新寄送連結」，進行重新設定密碼
					</Typography>
					<CoreButton variant='contained' label='重新寄送連結' onClick={handleForgetPassword} />
				</Box>
			);
		default:
			return <>N/A</>;
	}
};

export default CoreResetPasswordForm;
