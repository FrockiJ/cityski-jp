import { Box, styled } from '@mui/material';

const StyledWrapper = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'lines',
})<{ lines?: number }>(({ lines }) => ({
	whiteSpace: 'pre-line',
	overflow: 'hidden',
	textOverflow: 'ellipsis',
	display: '-webkit-box',
	wordBreak: 'break-all',
	WebkitLineClamp: lines,
	WebkitBoxOrient: 'vertical',
}));

export { StyledWrapper };
