import { Box, styled } from '@mui/material';

const StyledFormHelperText = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'startError' && prop !== 'width',
})<{ width?: string; startError: boolean }>(({ theme, width, startError }) => ({
	...theme.typography.caption,
	color: startError ? theme.palette.error.main : theme.palette.text.primary,
	width,
}));

export { StyledFormHelperText };
