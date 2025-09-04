import { useEffect } from 'react';
import { Box } from '@mui/material';
import { ErrorMessage, useFormikContext } from 'formik';


export const FormikScrollToError = () => {
	// must be inside <Formik/> component...
	const { isSubmitting, isValid, errors } = useFormikContext();

	useEffect(() => {
		if (!isSubmitting) return;

		if (!isValid && Object.keys(errors).length > 0) {
			document.getElementsByName(Object.keys(errors)[0])[0]?.scrollIntoView({ block: 'center' });
		}
	}, [errors, isSubmitting, isValid]);

	return null;
};

export const FormikErrorMessage = ({ name }: { name: string }) => {
	return (
		<ErrorMessage
			name={name}
			render={(message) => <Box sx={{ fontSize: 12, mt: 1, ml: 1.5, color: 'error.main' }}>{message}</Box>}
		/>
	);
};
