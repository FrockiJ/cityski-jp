import * as React from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import InputField from '@/components/Project/Shared/Common/InputField';
import Modal from '@/components/Project/Shared/Common/Modal';
import { FormProvider } from '@/components/Project/Shared/Context/FormContext';

import Button from '../Shared/Common/Button';
import ConfirmEmailModal from '../Shared/LoginRegister/ConfirmEmailModal';
import { showToast } from '../Utils/Toast';

import PlsUseLineLoginModal from './PlsUseLineLoginModal';

interface ForgotPasswordProps {
	isOpen: boolean;
	onClose: () => void;
}

const validationSchema = Yup.object({
	email: Yup.string().required('必填欄位').email('請輸入有效的電子郵件'),
});

function ForgotPassword({ isOpen, onClose }: ForgotPasswordProps) {
	const [isSubmitting, setIsSubmitting] = React.useState(false);
	const [isConfirmEmailModalOpen, setIsConfirmEmailModalOpen] = React.useState(false);
	const [isPlsUseLineLoginModalOpen, setIsPlsUseLineLoginModalOpen] = React.useState(false);

	const formik = useFormik({
		initialValues: { email: '' },
		validationSchema,
		onSubmit: async (values) => {
			try {
				setIsSubmitting(true);
				const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/forgot-password`, {
					email: values.email.toLowerCase(),
				});

				if (response.status === 201) {
					showToast('重設密碼信件已寄出', 'success');
					setIsConfirmEmailModalOpen(true);
					// onClose(); DON'T CLOSE THE PREVIOUS MODAL YET OR THE EMAIL WILL NOT BE PASSED DOWN
				}
				// eslint-disable-next-line unused-imports/no-unused-vars
			} catch (error) {
				if (error.response.status === 400 && error.response.data.message === '此帳號非Email註冊，請使用Line登入') {
					setIsPlsUseLineLoginModalOpen(true);
					onClose();
				} else {
					showToast(error.response.data.message, 'error');
				}
			} finally {
				setIsSubmitting(false);
			}
		},
	});

	const hasReset = React.useRef(false);

	// Reset form when modal closes
	React.useEffect(() => {
		if (!isOpen && !hasReset.current) {
			hasReset.current = true;
			formik.resetForm();
		} else if (isOpen) {
			hasReset.current = false;
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isOpen]);

	return (
		<>
			<Modal
				isOpen={isOpen}
				onClose={onClose}
				title='忘記密碼'
				closeOnOutsideClick={false}
				footer={
					<>
						<Button variant='secondary' onClick={onClose} disabled={isSubmitting}>
							取消
						</Button>
						<Button type='submit' form='forgotPasswordForm' disabled={isSubmitting}>
							送出
						</Button>
					</>
				}
			>
				<FormProvider value={formik}>
					<div className='min-w-[280px] w-[400px] max-w-full'>
						<form id='forgotPasswordForm' onSubmit={formik.handleSubmit} className='flex flex-col px-8 pt-4 pb-10'>
							<p className='text-sm leading-6 text-zinc-500 mb-2'>輸入您的電子郵件以重設密碼</p>
							<InputField label='Email' type='email' id='email' />
						</form>
					</div>
				</FormProvider>
			</Modal>
			<ConfirmEmailModal
				email={formik.values.email}
				type='forgotPassword'
				isOpen={isConfirmEmailModalOpen}
				onClose={() => {
					setIsConfirmEmailModalOpen(false);
					onClose(); // CLOSE THE MODAL HERE
				}}
			/>
			<PlsUseLineLoginModal
				isOpen={isPlsUseLineLoginModalOpen}
				onClose={() => {
					setIsPlsUseLineLoginModalOpen(false);
				}}
			/>
		</>
	);
}

export default ForgotPassword;
