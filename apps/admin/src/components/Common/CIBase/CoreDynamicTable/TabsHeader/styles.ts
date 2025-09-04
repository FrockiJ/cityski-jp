import { Box, styled } from '@mui/material';

export const StyledTabsWrapper = styled(Box)(({ theme }) => ({
	display: 'flex',
	width: '100%',
	background: theme.palette.background.default,
	borderBottom: '1px solid rgba(145, 158, 171, 0.32)',
}));

export const StyledTabCount = styled(Box)(({ theme }) => ({
	display: 'flex',
	width: '20px',
	height: '20px',
	justifyContent: 'center',
	alignItems: 'center',
	borderRadius: '6px',
	color: theme.palette.primary.main,
	background: theme.palette.background.default,
	marginRight: '8px',
	fontSize: '12px',
	fontWeight: 700,
	lineHeight: '20px',
}));

export const StyledTabLabel = styled(Box)(() => ({
	display: 'flex',
}));
