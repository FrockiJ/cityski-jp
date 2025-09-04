import { styled } from '@mui/material';

export const StyledTitle = styled('div')(({ theme }) => ({
	...theme.typography.body2,
	display: 'flex',
	alignItems: 'center',
	color: theme.palette.grey['600'],
	marginBottom: '4px',
}));
