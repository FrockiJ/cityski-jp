import { styled } from '@mui/material/styles';

const StyledActionArea = styled('div', {
	shouldForwardProp: (prop) => prop !== 'justifyContent',
})<{ justifyContent: 'space-between' | 'flex-end' }>(({ justifyContent }) => ({
	padding: 24,
	display: 'flex',
	alignItems: 'center',
	justifyContent,
	borderTop: '1px solid rgba(145, 158, 171, 0.24)',
	width: '100%',
	position: 'absolute',
	left: 0,
	bottom: 0,
}));

const StyledDiscountTypeInfo = styled('div')(({ theme }) => ({
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'baseline',
	padding: '12px 16px',
	marginBottom: 24,
	borderRadius: 8,
	backgroundColor: theme.palette.background.light,
}));

export { StyledActionArea, StyledDiscountTypeInfo };
