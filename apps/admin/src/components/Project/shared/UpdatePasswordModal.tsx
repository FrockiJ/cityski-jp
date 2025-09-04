import React, { useState } from 'react';
import { DialogAction, HttpStatusCode } from '@repo/shared';
import { Form, Formik, FormikProps } from 'formik';
import * as Yup from 'yup';

import CoreLoaders from '@/CIBase/CoreLoaders';
import CoreModalContent from '@/CIBase/CoreModal/ModalContent';
import { FormikScrollToError } from '@/CIBase/Formik/common/FormikComponents';
import FormikInput from '@/CIBase/Formik/FormikInput';
import api from '@/utils/http/api';
import { generalErrorHandler } from '@/utils/http/handler';
import { useLazyRequest } from '@/utils/http/hooks';

interface InitialValuesProps {
	updateType: 'default' | 'update';
	oldPassword?: string;
	newPassword: string;
	repeatNewPassword: string;
}

interface UpdatePasswordModalProps {
	updateType: 'default' | 'update';
	handleCloseModal?: (action: DialogAction) => void;
	formRef?: React.RefObject<FormikProps<InitialValuesProps>>;
}

const UpdatePasswordModal = ({ updateType, handleCloseModal, formRef }: UpdatePasswordModalProps) => {
	// --- API ---

	const [updatePassword, { loading: updatePasswordLoading }] = useLazyRequest(api.updatePassword, {
		onError: generalErrorHandler,
	});

	// --- FORMIK ---

	const [initialValues] = useState<InitialValuesProps>({
		updateType,
		oldPassword: undefined,
		newPassword: '',
		repeatNewPassword: '',
	});

	const validationSchema = Yup.object().shape({
		updateType: Yup.string(),
		oldPassword: Yup.string()
			.min(8, '密碼至少8位數')
			.max(16, '密碼最多16位數')
			.matches(/[0-9]/, '密碼需包含一個數字')
			.matches(/[A-Z]/, '密碼需包含一個大寫英文字母')
			.when(['updateType'], { is: 'update', then: (schema) => schema.required('必填欄位') }),
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

	const handleOnSubmit = async (values: InitialValuesProps) => {
		const { oldPassword, newPassword, repeatNewPassword } = values;

		const { statusCode } = await updatePassword({ oldPassword, newPassword, repeatNewPassword });

		if (statusCode === HttpStatusCode.OK) {
			handleCloseModal?.(DialogAction.CONFIRM);
		}
	};

	const isLoading = updatePasswordLoading;

	return (
		<Formik
			innerRef={formRef}
			enableReinitialize
			initialValues={initialValues}
			validationSchema={validationSchema}
			onSubmit={handleOnSubmit}
		>
			{({ isSubmitting }) => (
				<Form autoComplete='off'>
					{isLoading || (isSubmitting && <CoreLoaders hasOverlay />)}
					<FormikScrollToError />
					<CoreModalContent padding='24px 0'>
						{updateType === 'update' && (
							<FormikInput
								name='oldPassword'
								title='目前密碼'
								placeholder='輸入'
								isRequired
								width='100%'
								type='password'
								margin='0 0 24px 0'
							/>
						)}

						<FormikInput
							name='newPassword'
							title='新密碼'
							placeholder='輸入'
							isRequired
							width='100%'
							type='password'
							helperText='密碼至少8位數，要包含一個大寫英文字母與一個數字'
						/>

						<FormikInput
							name='repeatNewPassword'
							title='新密碼驗證'
							placeholder='輸入'
							isRequired
							width='100%'
							type='password'
							margin='24px 0 0 0'
						/>
					</CoreModalContent>
				</Form>
			)}
		</Formik>
	);
};

export default UpdatePasswordModal;
