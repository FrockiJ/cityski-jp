'use client';

import React from 'react';
import { useSelector } from 'react-redux';
import { MemberType } from '@repo/shared';
import { useFormik } from 'formik';
import { useParams } from 'next/navigation';
import * as Yup from 'yup';

import Button from '@/components/Project/Shared/Common/Button';
import InputField from '@/components/Project/Shared/Common/InputField';
import { FormProvider } from '@/components/Project/Shared/Context/FormContext';
import { selectToken, selectUserInfo } from '@/state/slices/authSlice';

import { showToast } from '../Utils/Toast';

const validationSchema = Yup.object({
	oldPassword: Yup.string().required('必填欄位'),
	newPassword: Yup.string()
		.min(8, '密碼至少8位數，要包含一個大寫英文字母與一個數字')
		.matches(/[A-Z]/, '密碼至少8位數，要包含一個大寫英文字母與一個數字')
		.matches(/[0-9]/, '密碼至少8位數，要包含一個大寫英文字母與一個數字')
		.required('必填欄位'),
	confirmPassword: Yup.string()
		.oneOf([Yup.ref('newPassword')], '與目前新密碼不符')
		.required('必填欄位'),
});

const ChangePassword = () => {
	const params = useParams();
	const memberId = params.id as string;
	const userInfo = useSelector(selectUserInfo);
	const authToken = useSelector(selectToken);

	const formik = useFormik({
		initialValues: {
			oldPassword: '',
			newPassword: '',
			confirmPassword: '',
		},
		validationSchema,
		onSubmit: async (values, { setSubmitting, resetForm }) => {
			try {
				const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/member/change-password`, {
					method: 'PATCH',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${authToken}`,
					},
					body: JSON.stringify({
						memberId,
						oldPassword: values.oldPassword,
						newPassword: values.newPassword,
					}),
				});

				const data = await response.json();

				if (!response.ok) {
					throw new Error(data.message || '密碼更新失敗');
				}

				resetForm();
				showToast('密碼更新成功', 'success');
			} catch (error) {
				console.error('Error changing password:', error);
				showToast(error.message, 'error');
			} finally {
				setSubmitting(false);
			}
		},
	});

	return (
		<main className='flex flex-col max-w-[856px] max-xs:ml-0 max-xs:w-full'>
			<div className='flex flex-col items-start pt-8 pr-20 pb-40 pl-8 whitespace-nowrap bg-white rounded-2xl border border-solid border-zinc-300 max-w-[856px] max-xs:px-0 max-xs:pt-0 max-xs:pb-24 max-xs:border-none'>
				<h1 className='text-2xl font-medium tracking-tight leading-loose text-zinc-800 max-xs:hidden'>修改密碼</h1>
				{userInfo?.type === MemberType.E ? (
					<FormProvider value={formik}>
						<form
							onSubmit={formik.handleSubmit}
							className='flex flex-col mt-8 max-w-full w-[335px] gap-3 max-xs:mt-0 max-xs:w-full'
						>
							<InputField label='舊密碼' type='password' id='oldPassword' />
							<InputField label='新密碼' type='password' id='newPassword' />
							<InputField label='確認新密碼' type='password' id='confirmPassword' />

							<div className='flex justify-end mt-2'>
								<Button type='submit' className='w-[80px] h-[48px] max-xs:w-full' disabled={formik.isSubmitting}>
									{formik.isSubmitting ? '更新中...' : '確定'}
								</Button>
							</div>

							{/* {formik.status && (
								<div
									className={`text-sm mt-2 text-center ${formik.status.includes('失敗') ? 'text-red-500' : 'text-green-500'}`}
								>
									{formik.status}
								</div>
							)} */}
						</form>
					</FormProvider>
				) : (
					<p className='mt-4 text-base text-center text-zinc-800'>使用 LINE 登入的帳號無法修改密碼。</p>
				)}
			</div>
		</main>
	);
};

export default ChangePassword;
