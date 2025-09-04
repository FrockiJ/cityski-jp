import { alpha, Box, styled } from '@mui/material';

export const StyledLoaderWrapper = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'hasOverlay',
})<{ hasOverlay?: boolean }>(({ hasOverlay }) => ({
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'center',
	alignItems: 'center',
	padding: '20px 0 0',

	...(hasOverlay && {
		width: '100%',
		height: '100%',
		background: alpha('#FFF', 0.8),
		position: 'absolute',
		right: 0,
		bottom: 0,
		zIndex: 15,
	}),
}));

export const StyledText = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'textColor',
})<{ textColor?: string }>(({ theme, textColor }) => ({
	...theme.typography.body2,
	color: textColor,
	marginTop: 8,
}));
