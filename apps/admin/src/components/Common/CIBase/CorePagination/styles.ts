import { Box, MenuItem, styled } from '@mui/material';

export const StyledExpandIconWrapper = styled(Box)({
	position: 'absolute',
	right: 7,
	top: '0',
	bottom: '0',
	display: 'flex',
	alignItems: 'center',
	pointerEvents: 'none',
});

export const StyledMenuItem = styled(MenuItem)({
	fontSize: 14,
});
