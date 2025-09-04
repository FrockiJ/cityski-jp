'use client';
import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import MuiDialogActions from '@mui/material/DialogActions';
import { alpha, styled } from '@mui/material/styles';

export const StyledModalTitle = styled(DialogTitle, {
	shouldForwardProp: (prop) => prop !== 'noTitleBorder',
})<{ noTitleBorder?: boolean }>(({ theme, noTitleBorder }) => ({
	...theme.typography.h6,
	height: '76px',
	padding: '24px',
	borderBottom: noTitleBorder ? 'none' : `1px solid ${alpha(theme.palette.secondary.light, 0.24)}`,
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
		prop !== 'center' && prop !== 'fullscreen' && prop !== 'height' && prop !== 'contentBGColor',
})<{ fullscreen?: boolean; center?: boolean; height?: number | string; contentBGColor?: string }>(
	({ theme, fullscreen = false, center, height = 'auto', contentBGColor }) => ({
		padding: '0 24px',
		overflowY: 'auto',
		marginRight: 2,
		minHeight: 'calc(300px - 60px - 84.5px)',
		backgroundColor: contentBGColor ? contentBGColor : 'inherit', // Apply backgroundColor
		...(fullscreen
			? {
					background: '#F4F6F8',
					height: 'calc(100vh - 60px - 84.5px)',
				}
			: {
					height: height,
					maxHeight: 'calc(100vh - 48px - 48px - 60px - 84.5px)',
				}),
		// ...theme.mixins.scrollbar,
	}),
);

export const StyledModal = styled(Dialog, {
	shouldForwardProp: (prop) => prop !== 'size' && prop !== 'fullscreen' && prop !== 'width',
})<{ size?: string; fullscreen?: boolean; width?: string | number }>(({ theme, size, fullscreen, width }) => ({
	'& .MuiPaper-root': {
		margin: 0,
		minWidth: '614px',
		borderRadius: fullscreen ? 0 : theme.shape.borderRadius,
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
	height: '84px',
	padding: '24px',
	width: '100%',
	borderTop: noTopBorder ? 'none' : `1px solid ${alpha(theme.palette.secondary.light, 0.24)}`,
}));
