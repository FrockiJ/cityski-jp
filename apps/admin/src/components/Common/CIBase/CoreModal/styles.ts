import { alpha, Dialog, DialogActions as MuiDialogActions, DialogContent, DialogTitle, styled } from '@mui/material';

export const StyledModalTitle = styled(DialogTitle, {
	shouldForwardProp: (prop) => prop !== 'noTitleBorder',
})<{ noTitleBorder?: boolean }>(({ theme, noTitleBorder }) => ({
	...theme.typography.h6,
	height: 76,
	padding: 24,
	borderBottom: noTitleBorder ? 'none' : `1px solid ${alpha(theme.palette.text.quaternary, 0.24)}`,
}));

export const StyledModalContentWrapper = styled(DialogContent)({
	display: 'flex',
	flexDirection: 'column',
	overflow: 'hidden',
	padding: 0,
	'& > *': {
		display: 'flex',
		overflowY: 'auto',
	},
	'& > form': {
		flexDirection: 'column',
		'& > *': {
			display: 'flex',
			overflowY: 'auto',
		},
	},
});

export const StyledModalContent = styled(DialogContent, {
	shouldForwardProp: (prop) =>
		prop !== 'center' &&
		prop !== 'fullscreen' &&
		prop !== 'height' &&
		prop !== 'contentBGColor' &&
		prop !== 'marginBottom',
})<{
	fullscreen?: boolean;
	center?: boolean;
	height?: number | string;
	contentBGColor?: string;
	marginBottom?: boolean;
}>(({ theme, fullscreen = false, center, height = 'auto', contentBGColor, marginBottom }) => ({
	padding: '0 24px',
	overflowY: 'auto',
	marginRight: 2,
	minHeight: typeof height === 'number' && height <= 200 ? `${height}px` : 'calc(300px - 60px - 84.5px)',
	backgroundColor: contentBGColor ? contentBGColor : 'inherit', // Apply backgroundColor
	...(marginBottom && {
		marginBottom: 84, // for Apply custom action area height (usually custom action area set position: absolute)
	}),
	...(fullscreen
		? {
				display: 'flex',
				justifyContent: center ? 'center' : 'inherit',
				background: theme.palette.background.light,
				height: 'calc(100vh - 60px - 84.5px)',
			}
		: {
				height: height,
				maxHeight: 'calc(100vh - 48px - 48px - 60px - 84.5px)',
			}),
	...theme.mixins.scrollbar,
}));

export const StyledModal = styled(Dialog, {
	shouldForwardProp: (prop) => prop !== 'size' && prop !== 'fullscreen' && prop !== 'width',
})<{ size?: string; fullscreen?: boolean; width?: string | number }>(({ size, fullscreen, width }) => ({
	'& .MuiPaper-root': {
		margin: 0,
		borderRadius: fullscreen ? 0 : 16,
		overflowY: 'hidden',
		...(!fullscreen && {
			width: width || (size === 'large' ? '1000px' : size === 'medium' ? '720px' : '480px'),
			maxWidth: width || (size === 'large' ? '1000px' : size === 'medium' ? '720px' : '480px'),
		}),
	},
}));

export const StyledMuiModalActions = styled(MuiDialogActions, {
	shouldForwardProp: (prop) => prop !== 'noTopBorder',
})<{ noTopBorder?: boolean }>(({ theme, noTopBorder }) => ({
	height: 84,
	padding: 24,
	width: '100%',
	borderTop: noTopBorder ? 'none' : `1px solid ${alpha(theme.palette.text.quaternary, 0.24)}`,
}));

export const StyledAbsoluteModalActions = styled('div', {
	shouldForwardProp: (prop) => prop !== 'justifyContent' && prop !== 'gap',
})<{ justifyContent: 'space-between' | 'flex-end'; gap?: string }>(({ theme, justifyContent, gap }) => ({
	padding: 24,
	display: 'flex',
	justifyContent,
	borderTop: `1px solid ${alpha(theme.palette.text.quaternary, 0.24)}`,
	width: '100%',
	position: 'absolute',
	left: 0,
	bottom: 0,
	gap,
}));
