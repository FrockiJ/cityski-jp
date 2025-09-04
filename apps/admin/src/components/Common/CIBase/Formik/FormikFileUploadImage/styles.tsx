import { alpha, FormHelperText, styled, Tooltip, tooltipClasses, TooltipProps } from '@mui/material';

import {
	DARK_GREY,
	DIALOG_BACKGROUND,
	DISABLED,
	ERROR_BG,
	ERROR_MAIN,
	GREY,
	LIGHT_GREY,
	WHITE,
} from '@/shared/constants/colors';

export const StyledTitle = styled('div')(() => ({
	display: 'flex',
	alignItems: 'center',
	fontSize: 14,
	color: DARK_GREY,
	marginBottom: 5,
}));

export const StyledWrapper = styled('div')(() => ({
	display: 'flex',
	flexDirection: 'row',
	padding: 16,
	borderRadius: 8,
	background: LIGHT_GREY,
	gap: 12,
}));

export const StyledFileUploadImage = styled('div')(() => ({
	display: 'flex',
	flexDirection: 'column',
}));

export const StyledLabel = styled('label')<{
	name?: string;
	isUploaded: boolean;
	isDisabled: boolean;
	isError: boolean;
}>(({ isUploaded, isDisabled, isError }) => ({
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	justifyContent: 'center',
	position: 'relative',
	fontSize: 14,
	color: isDisabled ? DISABLED : isError ? ERROR_MAIN : GREY,
	backgroundColor: isDisabled ? alpha(GREY, 0.12) : isError ? ERROR_BG : alpha(GREY, 0.12),
	width: 136,
	height: 136,
	borderRadius: 12,
	borderColor: isDisabled ? DISABLED : isError ? '#FFAC82' : alpha(GREY, 0.48),
	borderWidth: 1,
	borderStyle: 'dashed',
	overflow: 'hidden',

	...(isUploaded
		? {
				'.zoom_in_icon, .remove_icon, .browse_icon': {
					display: 'none',
				},
				'&:hover': {
					'.zoom_in_icon, .remove_icon, .browse_icon': {
						display: 'block',

						'&:hover': {
							cursor: 'pointer',
							opacity: 0.7,
						},
					},
				},
			}
		: {
				'&:hover': {
					cursor: isDisabled ? 'not-allowed' : 'pointer',
					opacity: isDisabled ? 1 : 0.7,
				},
			}),
}));

export const StyledZoomInIconWrapper = styled('div')(() => ({
	width: 42,
	height: 42,
	position: 'absolute',
	top: 'calc(50% - 21px)',
	right: 'calc(50% - 21px)',
	color: WHITE,
	background: alpha(DARK_GREY, 0.7),
	borderRadius: '50%',
	padding: 5,
}));

export const StyledRemoveFileIconWrapper = styled('div')(() => ({
	position: 'absolute',
	top: 5,
	right: 5,
	color: DARK_GREY,
}));

export const StyledImageBrowseWrapper = styled('div')(() => ({
	position: 'absolute',
	left: 0,
	bottom: 0,
	width: '100%',
	color: '#FFF',
	textAlign: 'center',
	background: alpha(DARK_GREY, 0.5),
}));

export const StyledDescription = styled('div')<{ isDisabled?: boolean }>(({ isDisabled }) => ({
	fontSize: 12,
	color: isDisabled ? DISABLED : GREY,
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
