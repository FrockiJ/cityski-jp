'use client';

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { useFormik } from 'formik';
import { useRouter, useSearchParams } from 'next/navigation';
import * as Yup from 'yup';

import Button from '@/components/Project/Shared/Common/Button';
import InputField from '@/components/Project/Shared/Common/InputField';
import { FormProvider } from '@/components/Project/Shared/Context/FormContext';
import { setAuthToken, setUserInfo } from '@/state/slices/authSlice';

import ErrorInfo from '../Shared/Common/ErrorInfo';
import ConfirmEmailModal from '../Shared/LoginRegister/ConfirmEmailModal';

import ForgotPasswordModal from './ForgotPasswordModal';
import PlsUseLineLoginModal from './PlsUseLineLoginModal';

const validationSchema = Yup.object({
	email: Yup.string().required('必填欄位').email('錯誤的帳號格式'),
	password: Yup.string().required('必填欄位').min(8, '密碼至少需要8個字元'),
});

const LoginEmail = () => {
	const dispatch = useDispatch();
	const router = useRouter();
	const searchParams = useSearchParams();
	const [showForgotPassword, setShowForgotPassword] = useState(false);
	const [isConfirmEmailModalOpen, setIsConfirmEmailModalOpen] = useState(false);
	const [isLineLoginModalOpen, setIsLineLoginModalOpen] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');

	const formik = useFormik({
		// TODO: test data, remove later
		// initialValues: { email: 'michaelnccu@gmail.com', password: 'CitySk11' },
		initialValues: { email: '', password: '' },
		validationSchema,
		onSubmit: async (values, { setSubmitting }) => {
			try {
				console.log('ooooooo');
				const response = await axios.post(process.env.NEXT_PUBLIC_BACKEND_URL + '/api/auth/member/signin', {
					email: values.email,
					password: values.password,
				});

				const { userInfo, accessToken, refreshToken } = response.data.result;

				// Store tokens
				dispatch(setAuthToken(accessToken));
				localStorage.setItem('refresh_token', refreshToken);

				// Store user info
				dispatch(setUserInfo(userInfo));

				const redirectTo = searchParams.get('redirect') || '/';
				router.push(redirectTo);
			} catch (error) {
				console.log('error1:', error);
				if (error.response.status === 400 && error.response.data.message === '此帳號已註冊但尚未驗證') {
					setIsConfirmEmailModalOpen(true);
				}
				if (error.response.status === 400 && error.response.data.message === '此帳號非Email註冊，請使用Line登入') {
					setIsLineLoginModalOpen(true);
				}
				setErrorMessage(error.response.data.message);
			} finally {
				setSubmitting(false);
			}
		},
	});

	return (
		<>
			<FormProvider value={formik}>
				<section className='flex flex-col mt-6 whitespace-nowrap max-xs:mt-10'>
					<h1 className='text-4xl font-medium tracking-tighter leading-[58px] text-center text-zinc-800'>登入會員</h1>
					{errorMessage && <ErrorInfo message={errorMessage} leaveSpace='above' />}
					<form onSubmit={formik.handleSubmit} className='flex flex-col mt-6 w-full text-base text-zinc-500'>
						<div className='mb-3'>
							<InputField type='email' id='email' label='Email' />
						</div>
						<div className='mb-3'>
							<InputField type='password' id='password' label='密碼' />
						</div>
						<a
							href='#'
							className='self-end text-blue-600 hover:text-blue-700'
							onClick={(e) => {
								e.preventDefault();
								setShowForgotPassword(true);
							}}
						>
							忘記密碼？
						</a>
						<Button
							type='submit'
							className='px-6 py-5 w-full h-12 font-bold mt-10 max-xs:px-5'
							disabled={formik.isSubmitting}
						>
							{formik.isSubmitting ? '登入中...' : '登入'}
						</Button>
						{formik.status && <div className='text-red-500 text-sm mt-2 text-center'>{formik.status}</div>}
					</form>
					<p className='flex gap-2 items-center self-center mt-4 text-base'>
						<span className='self-stretch my-auto text-zinc-800'>還沒有城市滑雪帳號嗎？</span>
						<a
							href='/register'
							className='self-stretch my-auto font-medium text-blue-600 hover:text-blue-700 transition-colors duration-200 w-50'
						>
							註冊會員
						</a>
					</p>
				</section>
			</FormProvider>

			<ConfirmEmailModal
				isOpen={isConfirmEmailModalOpen}
				onClose={() => setIsConfirmEmailModalOpen(false)}
				email={formik.values.email}
				type='completeVerify'
			/>

			<ForgotPasswordModal isOpen={showForgotPassword} onClose={() => setShowForgotPassword(false)} />
			<PlsUseLineLoginModal isOpen={isLineLoginModalOpen} onClose={() => setIsLineLoginModalOpen(false)} />
		</>
	);
};

export default LoginEmail;
