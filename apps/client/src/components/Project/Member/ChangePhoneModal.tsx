import * as React from 'react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import Button from '@/components/Project/Shared/Common/Button';
import Modal from '@/components/Project/Shared/Common/Modal';
import { FormProvider } from '@/components/Project/Shared/Context/FormContext';
import { selectToken } from '@/state/slices/authSlice';

import PhoneInputField from '../Shared/Common/PhoneInputField';
import { showToast } from '../Utils/Toast';

interface ChangePhoneModalProps {
	isOpen: boolean;
	onClose: () => void;
}

const validationSchema = Yup.object({
	phone: Yup.string()
		.matches(/^[0-9]+$/, '請輸入有效的電話號碼')
		.required('必填欄位'),
	phoneCode: Yup.string(),
});

function ChangePhoneModal({ isOpen, onClose }: ChangePhoneModalProps) {
	const authToken = useSelector(selectToken);
	const [isPhoneVerified, setIsPhoneVerified] = useState(false);

	const formik = useFormik({
		initialValues: {
			phone: '',
			phoneCode: '',
		},
		validationSchema,
		onSubmit: async (values) => {
			if (!isPhoneVerified) {
				showToast('請先完成手機驗證', 'error');
				return;
			}

			try {
				await axios.patch(
					process.env.NEXT_PUBLIC_BACKEND_URL + '/api/member/profile',
					{ phone: values.phone },
					{
						headers: {
							Authorization: `Bearer ${authToken}`,
						},
					},
				);

				showToast('手機號碼 更新成功', 'success');
				onClose();
				setTimeout(() => window.location.reload(), 1500);
			} catch (error) {
				if (axios.isAxiosError(error)) {
					showToast(error.response?.data?.message || '修改失敗', 'error');
				}
			}
		},
	});

	const onSendCode = async (phone: string): Promise<boolean> => {
		try {
			const formattedPhone = `+886${phone.substring(1)}`;

			const response = await axios.post(process.env.NEXT_PUBLIC_BACKEND_URL + '/api/verification/send', {
				phoneNumber: formattedPhone,
			});
			return response.data.statusCode === 201;
		} catch (error) {
			if (axios.isAxiosError(error)) {
				showToast('發送驗證碼失敗', 'error');
				throw new Error(error.response?.data?.message || '發送驗證碼失敗');
			}
			throw new Error('發送驗證碼失敗');
		}
	};

	const onVerify = async (code: string, phone: string): Promise<boolean> => {
		try {
			const formattedPhone = `+886${phone.substring(1)}`;

			const response = await axios.post(process.env.NEXT_PUBLIC_BACKEND_URL + '/api/verification/verify', {
				phoneNumber: formattedPhone,
				code: code,
			});
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
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title='修改手機號碼'
			closeOnOutsideClick={false}
			footer={
				<>
					<Button variant='secondary' onClick={onClose}>
						取消
					</Button>
					<Button onClick={() => formik.handleSubmit()}>確認修改</Button>
				</>
			}
		>
			<div className='min-w-[280px] w-[400px] max-w-full'>
				<FormProvider value={formik}>
					<form onSubmit={formik.handleSubmit} className='px-8 pt-4 pb-8'>
						<p className='mb-4 text-sm text-zinc-600'>請先驗證手機號碼成功後，點擊「確認修改」按鈕</p>
						<PhoneInputField label='手機號碼' id='phone' onSendCode={onSendCode} onVerify={onVerify} />
					</form>
				</FormProvider>
			</div>
		</Modal>
	);
}

export default ChangePhoneModal;
