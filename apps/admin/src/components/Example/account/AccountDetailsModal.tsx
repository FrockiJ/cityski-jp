import { Form, Formik, FormikProps, FormikValues } from 'formik';
import * as Yup from 'yup';

import CoreModalContent from '@/CIBase/CoreModal/ModalContent';
import FormikInput from '@/CIBase/Formik/FormikInput';
import FormikSelect from '@/CIBase/Formik/FormikSelect';
// import useModalProvider from '@/hooks/useModalProvider';
import { ModalMode } from '@/shared/types/general';
// import { showToast } from '@/utils/ui/general';

interface AccountDetailsModalProps {
	onClick?: () => void;
	mutate?: any;
	mode?: ModalMode;
	accountId?: number;
	formRef?: React.RefObject<FormikProps<FormikValues>>;
}

const AccountDetailsModal = ({
	onClick: close,
	// mutate,
	mode = 'view',
	// accountId,
	formRef,
}: AccountDetailsModalProps) => {
	// const modal = useModalProvider();
	// const [data, setData] = useState<RoleAccessModel[] | undefined>(undefined);
	// const [companyCode, setCompanyCode] = useState('');
	const initialValues = {
		name: '',
		company: '',
		role: '',
		account: '',
		email: '',
	};

	const validationSchema = Yup.object().shape({
		name: Yup.string().required('必填欄位'),
		company: Yup.string().required('必填欄位'),
		role: Yup.string().required('必填欄位'),
		account: Yup.string()
			.matches(/^[^&=_'\-+,<>]*(?<!\.{2})$/, '格式不正確')
			.required('必填欄位'),
		email: Yup.string().email('無效的電子郵件地址').required('必填欄位'),
	});

	// useEffect(() => {
	//   if (initData) {
	//     const { result_data } = initData;
	//     setCompanyCode(result_data?.company.parent_id?.toString() || '');
	//     setInitialValues({
	//       name: result_data?.user_name,
	//       company: result_data?.company.parent_id?.toString(),
	//       unit: result_data?.company.company_id.toString(),
	//       role: result_data?.role_id.toString(),
	//       account: result_data?.account,
	//       email: result_data?.email,
	//       status: result_data?.status,
	//     });
	//   }
	// }, [initData]);

	// useEffect(() => {
	//   setSchema((prev) => )
	// },[])

	// const onCancel = () => {
	// 	close?.();
	// };

	// const handleSendVerifyLetter = async () => {
	// 	modal.openMessageModal({
	// 		type: 'error',
	// 		title: '重寄開通密碼',
	// 		content: '請確認是否重寄開通密碼，新密碼將會寄發至使用者 email',
	// 		confirmLabel: '停用',
	// 		onClose: (action) => {
	// 			showToast('密碼已重寄', 'success');
	// 			close?.();
	// 		},
	// 	});
	// };

	// if (!menuData || loading) return <Loader />;

	return (
		<Formik
			innerRef={formRef}
			enableReinitialize
			initialValues={initialValues}
			validationSchema={validationSchema}
			onSubmit={async () => {
				// setSubmitting(true);
				close?.();
				// setSubmitting(false);
			}}
		>
			{({ handleBlur }) => (
				<Form autoComplete='off'>
					<CoreModalContent>
						<FormikInput
							title='姓名'
							placeholder='輸入姓名'
							name='name'
							disabled={mode === 'view'}
							isRequired
							width='100%'
						/>
						<FormikSelect
							title='公司'
							placeholder='選擇公司'
							name='company'
							options={[
								{ label: '雲端互動1', value: '1' },
								{ label: '雲端互動2', value: '2' },
							]}
							isRequired
							onBlur={handleBlur}
							width='100%'
							menuPortal
							disabled={mode === 'view'}
							margin='24px 0 0 0'
						/>
						<FormikSelect
							title='角色'
							placeholder='選擇角色'
							name='role'
							options={[
								{ label: '超級管理員', value: '3' },
								{ label: '管理員', value: '4' },
							]}
							isRequired
							onBlur={handleBlur}
							width='100%'
							margin='24px 0 0 0'
							menuPortal
							disabled={mode === 'view'}
						/>

						<FormikInput
							title='帳號'
							placeholder='輸入帳號'
							name='account'
							disabled={mode === 'view'}
							isRequired
							width='100%'
							margin='24px 0 0 0'
						/>

						<FormikInput
							title='Email'
							placeholder='輸入Email'
							name='email'
							disabled={mode === 'view'}
							isRequired
							margin='24px 0 0 0'
							width='100%'
						/>
					</CoreModalContent>

					{/* <ModalActions>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                width: '100%',
                gap: '12px',
              }}
            >
              <>
                <Button
                  variant="outlined"
                  label="取消"
                  onClick={() => onCancel()}
                />
                <Button
                  color="primary"
                  variant="contained"
                  type="submit"
                  label={'確認'}
                  isSubmitting={isSubmitting}
                />
              </>
            </Box>
          </ModalActions> */}
				</Form>
			)}
		</Formik>
	);
};

export default AccountDetailsModal;
