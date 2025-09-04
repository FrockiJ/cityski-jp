import { Paper } from '@mui/material';
import { styled } from '@mui/material';

export const StyledPaper = styled(Paper, {
	shouldForwardProp: (prop) => prop !== 'card' && prop !== 'dropdown' && prop !== 'modal',
})<{ card?: boolean; dropdown?: boolean; modal?: boolean }>(({ card, dropdown, modal }) => ({
	borderRadius: 16,
	// Condition style
	...(card && {
		boxShadow: '0px 0px 2px rgba(145, 158, 171, 0.2), 0px 12px 24px -4px rgba(145, 158, 171, 0.12)',
	}),
	...(dropdown && {
		boxShadow: '-20px 20px 40px -4px rgba(145, 158, 171, 0.24), 0px 0px 2px rgba(145, 158, 171, 0.24)',
	}),
	...(modal && {
		boxShadow: '-40px 40px 80px -8px rgba(145, 158, 171, 0.24)',
	}),
}));
