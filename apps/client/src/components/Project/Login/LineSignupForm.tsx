'use client';

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import dayjs from 'dayjs';
import { useFormik } from 'formik';
import { useRouter, useSearchParams } from 'next/navigation';
import * as Yup from 'yup';

import Button from '@/components/Project/Shared/Common/Button';
import InputField from '@/components/Project/Shared/Common/InputField';
import { FormProvider } from '@/components/Project/Shared/Context/FormContext';
import AcceptTerms from '@/components/Project/Shared/LoginRegister/AcceptTerms';
import { setAuthToken, setUserInfo } from '@/state/slices/authSlice';

import PhoneInputField from '../Shared/Common/PhoneInputField';
import { showToast } from '../Utils/Toast';

const validationSchema = Yup.object({
	name: Yup.string().required('請輸入姓名'),
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
	phone: Yup.string()
		.matches(/^[0-9]+$/, '請輸入有效的電話號碼')
		.required('請輸入電話號碼'),
	termsAccepted: Yup.boolean().oneOf([true], '請勾選並同意本站條款').required('請勾選並同意本站條款'),
});

const LineSignupForm = () => {
	const router = useRouter();
	const dispatch = useDispatch();
	const searchParams = useSearchParams();
	const [isPhoneVerified, setIsPhoneVerified] = useState(false);

	const formik = useFormik({
		initialValues: {
			name: '',
			birthday: '',
			phone: '',
			phoneCode: '',
			termsAccepted: false,
		},
		validationSchema,
		onSubmit: async (values) => {
			if (!isPhoneVerified) {
				showToast('請先完成手機驗證', 'error');
				return;
			}

			const accessToken = searchParams.get('token');
			const idToken = searchParams.get('id_token');

			// eslint-disable-next-line unused-imports/no-unused-vars
			const { termsAccepted, phoneCode, ...dataToSend } = values;

			try {
				const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/member/line-signup`, {
					...dataToSend,
					access_token: accessToken,
					id_token: idToken,
				});

				const { result } = response.data;

				// Store tokens
				dispatch(setAuthToken(result.accessToken));
				localStorage.setItem('refresh_token', result.refreshToken);

				// Store user info
				dispatch(setUserInfo(result.userInfo));

				// Redirect to home
				router.push('/');
			} catch (error) {
				console.error('Error details:', error.response?.data || error.message);
				// You might want to show an error message to the user here
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
				<h1 className='text-4xl font-medium tracking-tighter leading-[58px] text-center text-zinc-800 mb-6'>
					LINE 快速登入
				</h1>

				<form onSubmit={formik.handleSubmit} className='flex flex-col'>
					<div className='flex flex-col gap-3'>
						<InputField label='姓名' id='name' />
						<InputField label='生日' id='birthday' />
					</div>

					<div className='flex relative flex-col mt-3 w-full'>
						<PhoneInputField label='手機號碼' id='phone' onSendCode={onSendCode} onVerify={onVerify} />
					</div>

					<div className='flex flex-col mt-6 w-full'>
						<AcceptTerms id='termsAccepted' />
						<Button type='submit' className='h-12 mt-4 w-full text-base font-bold'>
							確認
						</Button>
					</div>
				</form>
			</section>
		</FormProvider>
	);
};

export default LineSignupForm;
