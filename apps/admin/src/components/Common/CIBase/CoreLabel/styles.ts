import { Box,styled } from '@mui/material';

export const StyledLabel = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'color',
})<{ color: { text: string; background: string } }>(({ color }) => ({
	fontSize: 12,
	lineHeight: '20px',
	fontWeight: 700,
	height: 24,
	minWidth: 22,
	borderRadius: 6,
	cursor: 'default',
	display: 'inline-flex',
	justifyContent: 'center',
	alignItems: 'center',
	whiteSpace: 'nowrap',
	padding: '0px 8px',
	color: color.text,
	backgroundColor: color.background,
}));
