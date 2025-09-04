import { alpha, styled } from '@mui/material';

export const AppWrapper = styled('div')(({ theme }) => ({
	backgroundColor: theme.palette.background.default,
	color: theme.palette.text.primary,
	display: 'flex',
	minHeight: '100vh',
	overflow: 'hidden',
}));

export const MainWrapper = styled('div')({
	flexGrow: '1',
	display: 'flex',
	flexDirection: 'column',
	width: `calc(100vw - 280px)`,
});

export const MainContent = styled('div')({
	// padding: '36px 32px',
	padding: '40px',
});

export const HeaderWrapper = styled('div')(({ theme }) => ({
	height: 76,
	padding: '0 40px',
	display: 'flex',
	justifyContent: 'space-between',
	alignItems: 'center',
	borderBottom: `1px solid ${alpha(theme.palette.text.quaternary, 0.24)}`,
}));
