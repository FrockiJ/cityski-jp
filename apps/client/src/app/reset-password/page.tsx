'use client';

import { useState } from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import { useRouter, useSearchParams } from 'next/navigation';
import * as Yup from 'yup';

import Button from '@/components/Project/Shared/Common/Button';
import InputField from '@/components/Project/Shared/Common/InputField';
import { FormProvider } from '@/components/Project/Shared/Context/FormContext';
import ConfirmEmailModal from '@/components/Project/Shared/LoginRegister/ConfirmEmailModal';
import { showToast } from '@/components/Project/Utils/Toast';

const validationSchema = Yup.object({
	password: Yup.string()
		.required('必填欄位')
		.min(8, '密碼至少需要8個字元')
		.matches(/[a-z]/, '密碼需包含至少一個小寫字母')
		.matches(/[A-Z]/, '密碼需包含至少一個大寫字母')
		.matches(/[0-9]/, '密碼需包含至少一個數字'),
	confirmPassword: Yup.string()
		.required('必填欄位')
		.oneOf([Yup.ref('password')], '密碼不相符'),
});

type ResetState = 'form' | 'success' | 'expired';

export default function ResetPassword() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const token = searchParams.get('token');
	const [resetState, setResetState] = useState<ResetState>('form');
	const [email, setEmail] = useState<string>('');
	const [isConfirmEmailModalOpen, setIsConfirmEmailModalOpen] = useState<boolean>(false);

	const formik = useFormik({
		initialValues: {
			password: '',
			confirmPassword: '',
		},
		validationSchema,
		onSubmit: async (values) => {
			try {
				const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/reset-password`, {
					token,
					password: values.password,
				});

				if (response.status === 201) {
					setResetState('success');
				}
				// eslint-disable-next-line unused-imports/no-unused-vars
			} catch (error) {
				const tokenPayload = JSON.parse(atob(token.split('.')[1]));
				console.log('tokenPayload', tokenPayload);
				setEmail(tokenPayload.email);
				setResetState('expired');
			}
		},
	});

	const handleResendLink = async () => {
		try {
			const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/forgot-password`, { email });

			if (response.status === 201) {
				showToast('重設密碼信件已寄出', 'success');
				// show resend email modal
				setIsConfirmEmailModalOpen(true);
			}
			// eslint-disable-next-line unused-imports/no-unused-vars
		} catch (error) {
			showToast('寄送重設密碼信件失敗', 'error');
		}
	};

	if (!token) {
		router.push('/login');
		return null;
	}

	return (
		<div className='min-h-screen flex justify-center pt-[196px]'>
			<div className='min-w-[400px] bg-white p-8 rounded-3xl'>
				{resetState === 'form' && (
					<>
						<h2 className='text-[40px] font-medium mb-6 text-center'>重設密碼</h2>
						<FormProvider value={formik}>
							<form onSubmit={formik.handleSubmit} className='space-y-4'>
								<InputField label='密碼' type='password' id='password' placeholder='密碼' />
								<InputField label='確認密碼' type='password' id='confirmPassword' placeholder='確認密碼' />
								<div className='pt-4'>
									<Button type='submit' className='w-full h-12'>
										確定
									</Button>
								</div>
							</form>
						</FormProvider>
					</>
				)}

				{resetState === 'success' && (
					<div className='flex flex-col items-center'>
						<img src='/image/reset-pwd/reset-pwd-success.svg' alt='reset-pwd-success' />
						<h2 className='text-xl font-medium mb-2 mt-6 text-center'>重設密碼成功</h2>
						<p className='text-sm text-center mb-10'>請回到登入頁面，以新密碼登入平台</p>
						<Button onClick={() => router.push('/login')} className='w-[144px] h-12 mx-auto'>
							前往登入頁面
						</Button>
					</div>
				)}

				{resetState === 'expired' && (
					<div className='flex flex-col items-center'>
						<img src='/image/reset-pwd/reset-pwd-fail.svg' alt='reset-pwd-fail' />
						<h2 className='text-xl font-medium mb-2 mt-6 text-center'>重設密碼連結失效</h2>
						<p className='text-sm text-center mb-10'>此連結已經失效，請點擊「重新寄送連結」，進行重新設定密碼</p>
						<Button onClick={handleResendLink} className='w-[144px] h-12  mx-auto'>
							重新寄送連結
						</Button>
					</div>
				)}
			</div>
			<ConfirmEmailModal
				email={email}
				type='forgotPassword'
				isOpen={isConfirmEmailModalOpen}
				onClose={() => {
					setIsConfirmEmailModalOpen(false);
				}}
			/>
		</div>
	);
}
