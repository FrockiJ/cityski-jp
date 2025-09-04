import { alpha, FormControlLabel, FormControlLabelProps, styled, Switch } from '@mui/material';

export const StyledTitle = styled('div')(({ theme }) => ({
	...theme.typography.body2,
	display: 'flex',
	alignItems: 'center',
	color: theme.palette.grey['600'],
	marginBottom: '4px',
}));

export const StyledSwitch = styled(Switch)(({ theme, size }) => ({
	width: size === 'medium' ? 33 : 25,
	height: size === 'medium' ? 20 : 16,
	padding: 0,

	'& .MuiSwitch-switchBase': {
		padding: 0,
		margin: size === 'medium' ? 3 : 2,
		transitionDuration: '300ms',
		color: '#FFF !important',

		'&.Mui-checked': {
			transform: `translateX(${size === 'medium' ? 14 : 8}px)`,
			color: '#FFF',

			'& + .MuiSwitch-track': {
				opacity: 1,
				border: 0,
			},
			'&.Mui-disabled + .MuiSwitch-track': {
				color: '#FFF',
			},
		},
		'.MuiSwitch-thumb': {
			border: '6px solid #FFF',
		},
		'&.Mui-disabled + .MuiSwitch-track': {
			opacity: 0.48,
			backgroundColor: alpha('#919EAB', 0.48),
			cursor: 'not-allowed',
		},
	},
	'& .MuiSwitch-thumb': {
		boxSizing: 'border-box',
		width: size === 'medium' ? 14 : 10,
		height: size === 'medium' ? 14 : 10,
	},
	'& .MuiSwitch-track': {
		borderRadius: 26 / 2,
		backgroundColor: alpha('#919EAB', 0.48),
		opacity: 1,
		transition: theme.transitions.create(['background-color'], {
			duration: 300,
		}),
	},
}));

export const StyledFormControlLabel = styled(FormControlLabel)<{
	labelPlacement?: FormControlLabelProps['labelPlacement'];
}>(({ labelPlacement }) => ({
	'.MuiFormControlLabel-label': {
		typography: 'body2',
		paddingLeft: 9,
	},
	...(labelPlacement === 'end' && {
		'&.MuiFormControlLabel-root': {
			marginLeft: '0px !important',
		},
	}),
}));
