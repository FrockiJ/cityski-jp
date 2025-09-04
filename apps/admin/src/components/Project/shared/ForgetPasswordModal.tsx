import React, { useState } from 'react';
import { DialogAction, HttpStatusCode, MessageType } from '@repo/shared';
import { Form, Formik, FormikProps } from 'formik';
import { useRouter } from 'next/router';
import * as Yup from 'yup';

import CoreLoaders from '@/CIBase/CoreLoaders';
import CoreModalContent from '@/CIBase/CoreModal/ModalContent';
import { FormikScrollToError } from '@/CIBase/Formik/common/FormikComponents';
import FormikInput from '@/CIBase/Formik/FormikInput';
import useModalProvider from '@/hooks/useModalProvider';
import { ROUTE } from '@/shared/constants/enums';
import api from '@/utils/http/api';
import { generalErrorHandler } from '@/utils/http/handler';
import { useLazyRequest } from '@/utils/http/hooks';

interface InitialValuesProps {
	email: string;
}

interface ForgetPasswordModalProps {
	handleCloseModal?: (action: DialogAction) => void;
	formRef?: React.RefObject<FormikProps<InitialValuesProps>>;
}

const ForgetPasswordModal = ({ handleCloseModal, formRef }: ForgetPasswordModalProps) => {
	const router = useRouter();
	const modal = useModalProvider();

	// --- API ---

	const [forgotPassword, { loading: forgotPasswordLoading }] = useLazyRequest(api.forgotPassword, {
		onError: generalErrorHandler,
	});

	// --- FORMIK ---

	const [initialValues] = useState<InitialValuesProps>({
		email: '',
	});

	const validationSchema = Yup.object().shape({
		email: Yup.string().email('錯誤的帳號格式').required('必填'),
	});

	const handleFormSubmit = async (values: InitialValuesProps) => {
		const { email } = values;

		const { statusCode } = await forgotPassword({ email, eitherEmailOrToken: true });

		if (statusCode === HttpStatusCode.OK) {
			handleCloseModal?.(DialogAction.CONFIRM);

			modal.openMessageModal({
				type: MessageType.INFO,
				title: '請重設密碼',
				// content: `請至 ${email} 重新設定密碼後再登入平台`,
				content: `請至 Email 電子信箱，重新設定密碼後再登入平台`,
				onClose: (action) => {
					if (action === DialogAction.CONFIRM) {
						router.push(ROUTE.LOGIN);
					}
					close?.();
				},
			});
		}
	};

	const isLoading = forgotPasswordLoading;

	return (
		<Formik
			innerRef={formRef}
			enableReinitialize
			initialValues={initialValues}
			validationSchema={validationSchema}
			onSubmit={handleFormSubmit}
		>
			{({ isSubmitting }) => (
				<Form autoComplete='off'>
					{isLoading || (isSubmitting && <CoreLoaders hasOverlay />)}
					<FormikScrollToError />
					<CoreModalContent padding='24px 0'>
						<FormikInput name='email' title='帳號' placeholder='輸入' isRequired width='100%' />
					</CoreModalContent>
				</Form>
			)}
		</Formik>
	);
};

export default ForgetPasswordModal;
