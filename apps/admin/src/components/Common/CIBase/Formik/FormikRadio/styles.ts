import { alpha, FormControlLabel, Radio, styled } from '@mui/material';

export const StyledTitle = styled('div')(({ theme }) => ({
	...theme.typography.body2,
	display: 'flex',
	alignItems: 'center',
	color: theme.palette.grey['600'],
	marginBottom: '4px',
}));

export const StyledRadio = styled(Radio)(({ theme }) => ({
	'&.MuiButtonBase-root.MuiRadio-root': {
		'&.Mui-checked': {
			'&.Mui-disabled': {
				color: alpha(theme.palette.text.disabled, 0.8),
			},
		},
		'&.Mui-disabled': {
			color: alpha(theme.palette.text.disabled, 0.8),
		},
	},
}));

export const StyledFormControlLabel = styled(FormControlLabel, {
	shouldForwardProp: (prop) => prop !== 'isCustomLabel' && prop !== 'isChecked' && prop !== 'hasDescription',
})<{ isCustomLabel?: boolean; isChecked?: boolean; hasDescription?: boolean }>(
	({ theme, isCustomLabel, isChecked, hasDescription }) => ({
		margin: 0,
		...(isCustomLabel && {
			borderRadius: 12,
			border: `1px solid ${alpha(theme.palette.text.quaternary, 0.24)}`,
			background: isChecked ? alpha(theme.palette.primary.main, 0.08) : 'transparent',
			...(hasDescription && {
				padding: '16px 10px',
			}),

			'&:hover:not(.Mui-disabled)': {
				background: isChecked ? alpha(theme.palette.primary.main, 0.08) : theme.palette.background.lighter,
			},
		}),
	}),
);
