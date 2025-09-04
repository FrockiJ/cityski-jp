import { Box } from '@mui/material';
import { styled } from '@mui/material';

const StyledWrapper = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'marginLeft',
})<{ marginLeft: string }>(({ marginLeft }) => ({
	display: 'flex',
	justifyContent: 'flex-start',
	marginLeft,
}));

const StyledToolBar = styled(Box)(() => ({
	marginTop: '26px',
	marginBottom: '20px',
	display: 'flex',
	justifyContent: 'space-between',
	alignItems: 'center',
}));

const StyledMsg = styled(Box)(({ theme }) => ({
	display: 'inline-flex',
	color: theme.palette.error.main,
	fontSize: 12,
	fontWeight: 400,
	marginLeft: '12px',
}));

const StyleLine = styled(Box)(({ theme }) => ({
	width: 1,
	height: 16,
	backgroundColor: theme.palette.grey[400],
}));

export { StyledWrapper, StyledToolBar, StyledMsg, StyleLine };
