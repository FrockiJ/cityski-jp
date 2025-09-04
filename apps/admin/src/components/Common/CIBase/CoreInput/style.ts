import { alpha, Box, styled } from '@mui/material';

import { SizeBreakPoint } from '@/shared/types/general';

export const Title = styled('p', {
	shouldForwardProp: (prop) => prop !== 'isRequired',
})<{ isRequired: boolean }>(({ theme, isRequired }) => ({
	...theme.typography.body2,
	display: 'flex',
	alignItems: 'center',
	color: theme.palette.text.secondary,
	marginBottom: 4,

	'&:after': {
		content: isRequired ? '"*"' : '""',
		color: theme.palette.error.main,
		marginLeft: 4,
	},
}));

export const SubTitle = styled('span')(({ theme }) => ({
	color: theme.palette.text.quaternary,
	fontSize: 14,
	fontWeight: 400,
	lineHeight: '20px',
	marginTop: 4,
}));

export const InputWrapper = styled(Box)(() => ({
	display: 'flex',
	alignItems: 'center',
	whiteSpace: 'nowrap',
}));

export const StartAdornment = styled(Box)(({ theme }) => ({
	display: 'flex',
	color: theme.palette.text.primary,
	marginRight: 8,
}));

export const EndAdornment = styled(Box)(({ theme }) => ({
	display: 'flex',
	color: theme.palette.text.secondary,
	paddingRight: 12,
}));

export const RootElement = styled('div')<{
	variant: 'headerSearch';
	rootStyle?: React.CSSProperties;
	size?: Exclude<SizeBreakPoint, 'large'>;
	hasClearIcon?: boolean;
}>(({ theme, rootStyle, variant, size, hasClearIcon }) => ({
	display: 'flex',
	alignItems: 'center',
	height: size === 'medium' ? 56 : 40,
	padding: '8px 0px 8px 14px',
	borderRadius: 8,
	border: `1px solid ${alpha(theme.palette.text.quaternary, 0.32)}`,
	transition: 'all 0.2s ease-in-out',
	overflow: 'hidden',
	...rootStyle,

	'&:hover, &:focus-within': {
		cursor: 'text',
		color: theme.palette.text.primary,
		borderColor: theme.palette.text.secondary,
	},

	'&.Mui-focused': {
		borderColor: theme.palette.text.secondary,
	},
	'&.Mui-error': {
		borderColor: theme.palette.error.main,
	},
	'&.Mui-disabled': {
		opacity: 0.5,

		'> input': {
			color: theme.palette.text.secondary,
		},
	},

	...(hasClearIcon && {
		padding: size === 'medium' ? '16px 0px 16px 14px' : '8px 0px 8px 14px',
	}),

	...(variant === 'headerSearch' && {
		width: 300,
		borderRadius: 50,
		background: theme.palette.background.light,
		border: 0,
		...rootStyle,
	}),
}));

export const InputElement = styled('input')<{
	inputStyle?: React.CSSProperties;
}>(({ theme, inputStyle }) => ({
	fontSize: 16,
	padding: 0,
	color: theme.palette.text.primary,
	background: 'transparent',
	border: 'none',
	width: '100%',
	textOverflow: 'ellipsis',
	overflow: 'hidden',
	whiteSpace: 'nowrap',
	...inputStyle,

	'&::placeholder': {
		color: theme.palette.text.quaternary,
		textAlign: 'left',
	},

	'&:focus-visible': {
		outline: 0,
	},
}));
