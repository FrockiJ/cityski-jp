import { FormGroup, FormHelperText, FormLabel, styled } from '@mui/material';

const StyledFormGroup = styled(FormGroup)(() => ({
	'& .MuiFormControlLabel-root.Mui-disabled': {
		cursor: 'not-allowed',
	},
}));

const StyledFormLabel = styled(FormLabel)(({ theme }) => ({
	...theme.typography.subtitle1,
	margin: '0 0 4px 0',
	color: 'text.primary',
}));

const StyledFormHelperText = styled(FormHelperText)(({ theme }) => ({
	...theme.typography.caption,
	color: 'error.main',
	margin: '0',
}));

const typographyStyle = { sx: { fontSize: '14px' } };
export { StyledFormGroup, StyledFormLabel, StyledFormHelperText, typographyStyle };
