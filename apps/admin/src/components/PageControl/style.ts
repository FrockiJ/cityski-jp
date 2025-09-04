import { Box, styled } from '@mui/material';

export const StyledPageControl = styled(Box)({
	display: 'flex',
	alignItems: 'center',
	marginBottom: 40,
});

export const PageTitle = styled('div')(({ theme }) => ({
	...theme.typography.h4,
	marginBottom: 8,
	width: 'fit-content',
	color: theme.palette.text.primary,
}));
