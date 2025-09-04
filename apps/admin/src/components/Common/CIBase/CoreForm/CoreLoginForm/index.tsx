import { useState } from 'react';
import { Typography } from '@mui/material';
import { DialogAction, HttpStatusCode } from '@repo/shared';
import { Form, Formik, FormikHelpers } from 'formik';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import * as Yup from 'yup';

import CoreButton from '@/CIBase/CoreButton';
import CoreLoaders from '@/CIBase/CoreLoaders';
import FormikInput from '@/CIBase/Formik/FormikInput';
import ChoseDepartmentModal from '@/components/Project/shared/ChoseDepartmentModal';
import * as Components from '@/components/Project/shared/Components';
import ForgetPasswordModal from '@/components/Project/shared/ForgetPasswordModal';
import useModalProvider from '@/hooks/useModalProvider';
import { ROUTE } from '@/shared/constants/enums';
import { setAuthToken, setNavList } from '@/state/slices/authSlice';
import { setActiveNav } from '@/state/slices/layoutSlice';
import { setUserDepartments, setUserInfo } from '@/state/slices/userSlice';
import { useAppDispatch } from '@/state/store';
import { isClient } from '@/utils/general';
import api from '@/utils/http/api';
import { generalErrorHandler } from '@/utils/http/handler';
import { useLazyRequest } from '@/utils/http/hooks';

interface InitialValuesProps {
	email: string;
	password: string;
}

const CoreLoginForm = () => {
	const dispatch = useAppDispatch();
	const modal = useModalProvider();
	const router = useRouter();
	const [isError, setIsError] = useState(false);

	// --- API ---
	const [signin, { loading: signinLoading }] = useLazyRequest(api.signin);

	const [userPermission, { loading: userPermissionLoading }] = useLazyRequest(api.userPermission, {
		onError: generalErrorHandler,
	});

	// --- FUNCTIONS ---

	const handleForgetPassword = () => {
		modal.openModal({
			title: `忘記密碼`,
			width: 480,
			noEscAndBackdrop: true,
			children: <ForgetPasswordModal />,
		});
	};

	// --- FORMIK ---

	const validationSchema = Yup.object().shape({
		email: Yup.string().email('錯誤的帳號格式').required('必填'),
		password: Yup.string().required('必填'),
	});

	const initialValues: InitialValuesProps = {
		// TODO: remove default login values in production
		email: 'systemadmin@example.com',
		password: 'Systemadmin@123',
	};

	const handleFormSubmit = async (values: InitialValuesProps, formikHelpers: FormikHelpers<InitialValuesProps>) => {
		try {
			const response = await signin(values);

			if (response.statusCode === HttpStatusCode.OK && response.result) {
				// TODO: backend should provide safer http-only cookies
				const date = new Date();
				date.setTime(date.getTime() + response.result.refreshExpiresIn * 1000);

				if (isClient()) {
					// store refresh token in cookies
					Cookies.set('refresh', response.result.refreshToken, {
						expires: response.result.refreshExpiresIn / (60 * 60 * 24),
						path: ROUTE.ROOT,
					});

					// set token valid flag
					if (process.env.NEXT_PUBLIC_TOKEN) {
						Cookies.set(process.env.NEXT_PUBLIC_TOKEN, process.env.NEXT_PUBLIC_TOKEN, {
							expires: response.result.expiresIn / (60 * 60 * 24),
						});
					}
				}

				// update activeNav in redux state to be stored in memory
				dispatch(
					setActiveNav({
						activeParent: ROUTE.DASHBOARD,
						activeCurrentNav: ROUTE.DASHBOARD,
					}),
				);

				// detect which departments user own
				if (response.result.departments.length === 1) {
					// set up departmentId for refresh token to get userPermission
					localStorage.setItem('departmentId', response.result.departments[0].id);

					// update accessToken in redux state to be stored in memory
					dispatch(setAuthToken(response.result.accessToken));

					const { result, statusCode } = await userPermission({ departmentId: response.result.departments[0].id });

					if (statusCode === HttpStatusCode.OK) {
						// update userInfo, departments, menus in redux state to be stored in memory
						dispatch(setUserInfo(result.userInfo));
						dispatch(setUserDepartments(result.departments));
						dispatch(setNavList(result.menus));
					}
					router.push(ROUTE.DASHBOARD);
				} else {
					modal.openModal({
						title: `選擇分店`,
						width: 480,
						noEscAndBackdrop: true,
						noAction: true,
						marginBottom: true,
						children: (
							<ChoseDepartmentModal
								departments={response.result.departments}
								accessToken={response.result.accessToken}
							/>
						),
						onClose: async (action) => {
							if (action === DialogAction.CONFIRM) {
								await router.push(ROUTE.DASHBOARD);
							}
						},
					});
				}
			}
			setIsError(false);
		} catch (error) {
			console.log('sign error', error);
			setIsError(true);
			formikHelpers.setFieldValue('password', '');
			formikHelpers.setFieldTouched('password', false);
		}
	};

	const isLoading = signinLoading || userPermissionLoading;

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
					<Typography variant='h4'>登入</Typography>
					<Typography variant='body1' sx={{ mt: 1, mb: 5, color: 'text.secondary' }}>
						請輸入您的帳號密碼
					</Typography>

					{isError && <Components.MessageHint color='error' message='錯誤帳號或密碼，請重新確認' />}

					<FormikInput title='信箱' placeholder='輸入帳號' name='email' width='100%' size='medium' />
					<FormikInput
						title='密碼'
						placeholder='輸入密碼'
						name='password'
						size='medium'
						type='password'
						width='100%'
						wrapperSxProps={{ margin: '32px 0' }}
					/>
					<CoreButton label='忘記密碼?' onClick={handleForgetPassword} />
					<CoreButton
						color='primary'
						variant='contained'
						type='submit'
						label='登入'
						fullWidth
						margin='20px 0 0 0'
						size='large'
						isSubmitting={isSubmitting}
					/>
				</Form>
			)}
		</Formik>
	);
};

export default CoreLoginForm;
