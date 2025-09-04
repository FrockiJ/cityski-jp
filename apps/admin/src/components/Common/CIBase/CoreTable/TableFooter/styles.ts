import { Box, styled } from '@mui/material';

export const StyledWrapper = styled(Box)({
	padding: 16,
	borderTop: '1px solid rgba(145, 158, 171, 0.24)',
	textAlign: 'right',
	fontWeight: 700,
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'flex-end',
	gap: 8,
	cursor: 'pointer',
});
