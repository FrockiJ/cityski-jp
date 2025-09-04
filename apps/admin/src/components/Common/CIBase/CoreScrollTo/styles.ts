import { styled } from '@mui/material';

const ToTop = styled('div')(({ theme }) => ({
	height: '32px',
	width: '32px',
	borderRadius: '3px',
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
	cursor: 'pointer',
	zIndex: 1,
	position: 'fixed',
	bottom: '2vh',
	backgroundColor: theme.palette.primary.basic,
	color: theme.palette.text.primary,
	'&:hover, &.Mui-focusVisible': {
		transition: '0.3s',
		backgroundColor: '#DCDCDC',
	},
	// responsive styles
	[theme.breakpoints.up('xs')]: {
		right: '1.5%',
		backgroundColor: 'rgb(220,220,220,0.7)',
	},
}));

export { ToTop };
