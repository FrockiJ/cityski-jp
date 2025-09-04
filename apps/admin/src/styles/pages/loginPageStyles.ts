import { styled } from '@mui/material';

const StyledWrapper = styled('div')({
	display: 'flex',
	minHeight: '100vh',
	width: '100%',
});

const StyledLeft = styled('div')({
	flex: '0 0 476px',
	padding: '16px',
});

const StyledLeftWrapper = styled('div')({
	display: 'flex',
	flexDirection: 'column',
	boxShadow: `0px 16px 32px -4px rgba(145, 158, 171, 0.16)`,
	borderRadius: '16px',
	padding: '40px',
	height: '100%',
});

const StyledRight = styled('div')({
	flex: '1',
	padding: '16px',
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
});

export { StyledWrapper, StyledLeft, StyledLeftWrapper, StyledRight };
