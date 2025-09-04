import { alpha, Box, styled } from '@mui/material';

export const StyledCount = styled(Box)(({ theme }) => ({
	background: alpha(theme.palette.text.quaternary, 0.24),
	fontSize: 12,
	fontWeight: 700,
	color: theme.palette.text.primary,
	borderRadius: 6,
	marginLeft: 8,
	padding: '2px 8px',
}));

export const StyledCountWrapper = styled(Box)(() => ({
	display: 'flex',
	alignItems: 'center',
}));

export const StyledTagGroup = styled(Box)(() => ({
	display: 'flex',
	gap: 4,
}));

export const StyledManagementWrapper = styled(Box)(() => ({
	display: 'flex',
	gap: 4,
}));
