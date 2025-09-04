import { alpha, styled } from '@mui/material';

const StyledDatePickerWrapper = styled('div', {
	shouldForwardProp: (prop) => prop !== 'width',
})<{ width?: string }>(({ theme, width }) => ({
	display: 'flex',
	flexDirection: 'column',

	'&:hover': {
		'.customDatePicker fieldset.MuiOutlinedInput-notchedOutline': {
			borderColor: theme.palette.text.secondary,
		},
		'.customDatePicker .Mui-disabled fieldset.MuiOutlinedInput-notchedOutline': {
			borderColor: alpha(theme.palette.text.quaternary, 0.32),
		},
	},

	'.customDatePicker .Mui-disabled': {
		cursor: 'not-allowed',
	},
	'.customDatePicker fieldset.MuiOutlinedInput-notchedOutline': {
		borderColor: alpha(theme.palette.text.quaternary, 0.24),
		borderWidth: '1px',
	},
	'.customDatePicker .Mui-focused fieldset.MuiOutlinedInput-notchedOutline': {
		borderColor: alpha(theme.palette.text.quaternary, 0.32),
		borderWidth: '1px',
	},
	'.customDatePicker .Mui-error fieldset.MuiOutlinedInput-notchedOutline': {
		borderColor: theme.palette.error.main,
	},

	...(width && {
		width,
	}),
}));

const StyledTitle = styled('div')(({ theme }) => ({
	...theme.typography.body2,
	display: 'flex',
	alignItems: 'center',
	color: theme.palette.grey['600'],
	marginBottom: '4px',
}));

export { StyledDatePickerWrapper, StyledTitle };
