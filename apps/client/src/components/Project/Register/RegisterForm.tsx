'use client';

import React, { useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import Button from '@/components/Project/Shared/Common/Button';
import InputField from '@/components/Project/Shared/Common/InputField';
import { FormProvider } from '@/components/Project/Shared/Context/FormContext';
import AcceptTerms from '@/components/Project/Shared/LoginRegister/AcceptTerms';
import OrDivider from '@/components/Project/Shared/LoginRegister/OrDivider';

import LineLoginButton from '../Login/LineLoginButton';
import ErrorInfo from '../Shared/Common/ErrorInfo';
import PhoneInputField from '../Shared/Common/PhoneInputField';
import ConfirmEmailModal from '../Shared/LoginRegister/ConfirmEmailModal';
import { showToast } from '../Utils/Toast';

import EmailAlreadyExistModal from './EmailAlreadyExistModal';

const validationSchema = Yup.object({
	name: Yup.string().required('必填欄位'),
	birthday: Yup.string()
		.required('必填欄位')
		.test('valid-date', '請輸入有效日期', function (value) {
			if (!value) return false;

			// Remove slashes and check length
			const numbers = value.replace(/\D/g, '');
			if (numbers.length !== 8) return false;

			const year = parseInt(numbers.substring(0, 4));
			const month = parseInt(numbers.substring(4, 6));
			const day = parseInt(numbers.substring(6, 8));

			// Basic range checks
			if (year < 1900 || year > new Date().getFullYear()) return false;
			if (month < 1 || month > 12) return false;
			if (day < 1 || day > 31) return false;

			// Check if date is valid (handles months with different days and leap years)
			const date = dayjs(`${year}-${month}-${day}`);
			if (!date.isValid()) return false;
			if (date.year() !== year || date.month() + 1 !== month || date.date() !== day) return false;

			// Check if date is not in the future
			if (date.isAfter(dayjs())) return false;

			return true;
		}),
	email: Yup.string().email('錯誤的帳號格式').required('必填欄位'),
	password: Yup.string()
		.min(8, '密碼至少8位數，要包含一個大寫英文字母與一個數字')
		.matches(/[A-Z]/, '密碼至少8位數，要包含一個大寫英文字母與一個數字')
		.matches(/[0-9]/, '密碼至少8位數，要包含一個大寫英文字母與一個數字')
		.required('必填欄位'),
	confirmPassword: Yup.string()
		.oneOf([Yup.ref('password')], '與目前新密碼不符')
		.required('必填欄位'),
	phone: Yup.string()
		.matches(/^[0-9]+$/, '請輸入有效的電話號碼')
		.required('必填欄位'),
	termsAccepted: Yup.boolean().oneOf([true], '請勾選並同意本站條款').required('請勾選並同意本站條款'),
});

const RegisterForm = () => {
	const [emailAlreadyExist, setEmailAlreadyExist] = useState(false);
	const [isConfirmEmailModalOpen, setIsConfirmEmailModalOpen] = useState(false);
	const [cannotRegisterReason, setCannotRegisterReason] = useState('account occupied');
	const [errorMessage, setErrorMessage] = useState('');
	const [resendType, setResendType] = useState<'verify' | 'forgotPassword' | 'completeVerify'>('verify');
	const [isPhoneVerified, setIsPhoneVerified] = useState(false);

	const formik = useFormik({
		initialValues: {
			// TODO: test data, remove later
			// name: 'MichaelE',
			// birthday: '1985/01/01',
			// email: 'michaelnccu@gmail.com',
			// password: 'CitySk11',
			// confirmPassword: 'CitySk11',
			// phone: '0912345678',
			// termsAccepted: true,
			name: '',
			birthday: '',
			email: '',
			password: '',
			confirmPassword: '',
			phone: '',
			termsAccepted: false,
		},
		validationSchema,
		onSubmit: async (values, { setSubmitting }) => {
			if (!isPhoneVerified) {
				showToast('請先完成手機驗證', 'error');
				return;
			}
			try {
				const response = await axios.post(process.env.NEXT_PUBLIC_BACKEND_URL + '/api/auth/member/signup', {
					name: values.name,
					birthday: values.birthday,
					email: values.email,
					password: values.password,
					phone: values.phone,
				});
				if (response.data.statusCode === 200) {
					setIsConfirmEmailModalOpen(true);
				}
			} catch (error) {
				setErrorMessage(error.response.data.message);
				if (error.response.data.message === '此帳號已註冊' && error.response.data.statusCode === 400) {
					setCannotRegisterReason('account occupied');
					setEmailAlreadyExist(true);
				} else if (error.response.data.message === '此帳號未驗證但已被註冊' && error.response.data.statusCode === 400) {
					setResendType('completeVerify');
					setIsConfirmEmailModalOpen(true);
				} else if (error.response.data.message === '此帳號已綁定LINE登入' && error.response.data.statusCode === 400) {
					setCannotRegisterReason('line occupied');
					setEmailAlreadyExist(true);
				} else {
					showToast('註冊失敗，請稍後再試', 'error');
				}
			} finally {
				setSubmitting(false);
			}
		},
	});

	const onSendCode = async (phone: string): Promise<boolean> => {
		try {
			const formattedPhone = `+886${phone.substring(1)}`;

			const response = await axios.post(process.env.NEXT_PUBLIC_BACKEND_URL + '/api/verification/send', {
				phoneNumber: formattedPhone,
			});
			console.log(response.data);
			return response.data.statusCode === 201;
		} catch (error) {
			if (axios.isAxiosError(error)) {
				showToast('發送驗證碼失敗', 'error');
				throw new Error(error.response?.data?.message || '發送驗證碼失敗');
			}
			throw new Error('發送驗證碼失敗');
		}
	};

	const onVerify = async (code: string): Promise<boolean> => {
		try {
			const formattedPhone = `+886${formik.values.phone.substring(1)}`;

			const response = await axios.post(process.env.NEXT_PUBLIC_BACKEND_URL + '/api/verification/verify', {
				phoneNumber: formattedPhone,
				code: code,
			});
			// console.log(response.data);
			const isVerified = response.data.statusCode === 201;
			setIsPhoneVerified(isVerified);
			return isVerified;
		} catch (error) {
			if (axios.isAxiosError(error)) {
				throw new Error(error.response?.data?.message || '驗證碼錯誤');
			}
			throw new Error('驗證碼錯誤');
		}
	};

	return (
		<FormProvider value={formik}>
			<section className='flex flex-col grow mt-6 max-xs:mt-10'>
				<h1 className='text-4xl font-medium tracking-tighter leading-[58px] text-center text-zinc-800'>註冊會員</h1>
				<div className='flex flex-col mt-6 w-full text-center'>
					<LineLoginButton />
					<p className='self-center mt-2 text-sm leading-6 text-zinc-800'>使用LINE登入，不需註冊</p>
				</div>
				<OrDivider />
				<form onSubmit={formik.handleSubmit} className='flex flex-col'>
					{errorMessage && <ErrorInfo message={errorMessage} leaveSpace='below' />}
					<div className='flex flex-col gap-3'>
						<InputField label='姓名' id='name' />
						<InputField label='生日' id='birthday' />
						<InputField label='Email' type='email' id='email' />
						<InputField label='密碼' type='password' id='password' showError={false} />
						{formik.touched.password && formik.errors.password ? (
							<p className='text-xs leading-none text-red-500'>{formik.errors.password}</p>
						) : (
							<p className='text-xs leading-none text-zinc-500'>密碼至少8位數，要包含一個大寫英文字母與一個數字</p>
						)}
						<InputField label='確認密碼' type='password' id='confirmPassword' />
					</div>

					<div className='flex relative flex-col mt-3 w-full'>
						<PhoneInputField label='手機號碼' id='phone' onSendCode={onSendCode} onVerify={onVerify} />
					</div>

					<div className='flex flex-col mt-6 w-full'>
						<AcceptTerms id='termsAccepted' />
						<Button type='submit' className='h-12 mt-4 w-full text-base font-bold' disabled={formik.isSubmitting}>
							{formik.isSubmitting ? '註冊中...' : '送出註冊'}
						</Button>
					</div>
				</form>

				<div className='flex gap-2 items-center self-center mt-4 text-base whitespace-nowrap'>
					<span className='self-stretch my-auto text-zinc-800'>已有城市滑雪帳號嗎？</span>
					<a href='/login' className='self-stretch my-auto font-medium text-blue-600 hover:text-blue-700'>
						登入會員
					</a>
				</div>
			</section>
			{emailAlreadyExist && (
				<EmailAlreadyExistModal
					email={formik.values.email}
					reason={cannotRegisterReason}
					isOpen={emailAlreadyExist}
					onClose={() => setEmailAlreadyExist(false)}
				/>
			)}
			<ConfirmEmailModal
				email={formik.values.email}
				type={resendType}
				isOpen={isConfirmEmailModalOpen}
				onClose={() => {
					setIsConfirmEmailModalOpen(false);
				}}
			/>
		</FormProvider>
	);
};

export default RegisterForm;
