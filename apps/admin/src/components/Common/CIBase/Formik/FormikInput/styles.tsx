import { alpha, FormHelperText, styled, Tooltip, tooltipClasses, TooltipProps } from '@mui/material';

import { DIALOG_BACKGROUND, GREY } from '@/shared/constants/colors';
import { SizeBreakPoint } from '@/shared/types/general';

import { FormikInputProps } from '.';

interface StyledInputWrapperProps {
	size?: Exclude<SizeBreakPoint, 'large'>;
	error?: boolean;
	width?: string | number;
	disabled?: boolean;
	readOnly?: boolean;
	hasClearIcon?: boolean;
	hasTextCountAdornment?: boolean;
	multiline?: boolean;
	inputStyle?: React.CSSProperties;
}

export const StyledInputWrapper = styled('div', {
	shouldForwardProp: (prop) =>
		prop !== 'error' &&
		prop !== 'hasClearIcon' &&
		prop !== 'hasTextCountAdornment' &&
		prop !== 'multiline' &&
		prop !== 'inputStyle',
})<StyledInputWrapperProps>(
	({ theme, width, size, disabled, readOnly, error, hasClearIcon, hasTextCountAdornment, multiline, inputStyle }) => ({
		display: 'flex',
		alignItems: 'center',
		position: 'relative',
		fontSize: 16,
		width,
		maxWidth: '100%',
		borderRadius: 8,
		color: theme.palette.text.primary,
		outline: '0',
		backgroundColor: '#FFF',
		border: `1px solid ${alpha(theme.palette.text.quaternary, 0.32)}`,
		transition: 'border-color 0.2s ease-in-out',
		'& input': {
			outline: 'none',
		},
		'&:hover, &:focus-within': {
			cursor: 'text',
			color: theme.palette.text.primary,
			borderColor: theme.palette.text.secondary,
		},
		padding: 16,
		// conditional styles
		...(inputStyle && {
			...inputStyle,
		}),
		...(hasClearIcon && {
			padding: size === 'medium' ? '16px 14px' : '8px 14px',
		}),
		...(multiline &&
			hasTextCountAdornment && {
				padding: '16px 10px 30px 16px',
			}),
		...(!multiline &&
			hasTextCountAdornment && {
				padding: '0 60px 0 16px',
			}),
		...(!multiline &&
			size && {
				height: size === 'medium' ? 56 : 40,
			}),
		...(disabled && {
			cursor: 'not-allowed',
			color: `${theme.palette.text.disabled} !important`,
			WebkitTextFillColor: theme.palette.text.disabled,
			borderColor: `${alpha(theme.palette.text.disabled, 0.24)} !important`,
			backgroundColor: theme.palette.background.light,
		}),
		...(readOnly && {
			border: 0,
			padding: 0,
		}),
		...(error && {
			borderColor: `${theme.palette.error.main} !important`,
		}),
	}),
);

export const StyledTitle = styled('div')(({ theme }) => ({
	...theme.typography.body2,
	display: 'flex',
	alignItems: 'center',
	color: theme.palette.text.secondary,
	marginBottom: 4,
}));

export const StyledTooltip = styled(
	({ className, placement = 'right', ...props }: TooltipProps & { maxWidth?: number; tooltipColor?: string }) => (
		<Tooltip {...props} classes={{ popper: className }} placement={placement} />
	),
)(({ maxWidth = 500, tooltipColor = DIALOG_BACKGROUND }) => ({
	[`& .${tooltipClasses.arrow}`]: {
		color: tooltipColor,
	},
	[`& .${tooltipClasses.tooltip}`]: {
		maxWidth,
		backgroundColor: tooltipColor,
	},
}));

export const StyledFormHelperText = styled(FormHelperText)({
	typography: 'caption',
	color: 'text.secondary',
	margin: '4px 0 0 15px',
});

export const StyledInput = styled('input')<Partial<FormikInputProps>>(({ theme, disabled, readOnly }) => ({
	backgroundColor: 'transparent',
	outlineWidth: 0,
	border: 'none',
	fontSize: 16,
	lineHeight: '24px',
	width: '100%',
	padding: '0',
	color: 'inherit',
	textOverflow: 'ellipsis',

	'&::placeholder': {
		color: theme.palette.text.quaternary,
		textAlign: 'left',
	},
	// conditional styles
	...(disabled && {
		cursor: 'not-allowed',
	}),
	...(readOnly && {
		padding: 0,
	}),
}));

export const StyledTextarea = styled('textarea')<Partial<FormikInputProps>>(
	({ theme, disabled, readOnly, textareaHeight }) => ({
		height: textareaHeight,
		backgroundColor: 'transparent',
		outlineWidth: 0,
		border: 'none',
		fontSize: 16,
		lineHeight: '24px',
		width: '100%',
		padding: 0,
		color: 'inherit',
		resize: 'none',

		'&::placeholder': {
			color: theme.palette.text.quaternary,
			textAlign: 'left',
		},
		// conditional styles
		...(disabled && {
			cursor: 'not-allowed',
		}),
		...(readOnly && {
			padding: 0,
		}),
		...theme.mixins.scrollbar,
	}),
);

export const StyledTextAdornment = styled('div')(() => ({
	position: 'absolute',
	right: 14,
	bottom: 6,
	fontSize: 14,
	color: GREY,
}));
