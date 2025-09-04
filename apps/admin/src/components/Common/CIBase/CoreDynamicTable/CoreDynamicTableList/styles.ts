import { styled, TableCell } from '@mui/material';

const CoOwner = styled('div')(() => ({
	display: 'inline-flex',
	background: 'rgba(145, 158, 171, 0.16)',
	borderRadius: 50,
	padding: '3px 8px',
	marginRight: 6,
	marginBottom: 6,
	whiteSpace: 'nowrap',
}));

const MoreButtonOverlay = styled('div')(() => ({
	position: 'absolute',
	top: 0,
	left: -10,
	width: '100%',
	height: '100%',
	background: '#fff',
	filter: 'blur(10px)',
}));

const MenuPaperProps = {
	elevation: 0,
	sx: {
		overflow: 'visible',
		borderRadius: 2,
		boxShadow: '1px 2px 10px rgba(125, 125, 125, 0.1)',
		'&:before': {
			content: '""',
			display: 'block',
			position: 'absolute',
			top: 25,
			right: -5,
			width: 10,
			height: 10,
			bgcolor: 'background.paper',
			transform: 'translateY(-50%) rotate(45deg)',
			zIndex: 0,
		},
	},
};

const StyledTableCell = styled(TableCell)(() => ({
	position: 'sticky',
	right: 0,
	background: 'linear-gradient(270deg, #fff, rgba(255,255,255,.8) 90%)',
	zIndex: 99,
}));

export { CoOwner, MoreButtonOverlay, MenuPaperProps, StyledTableCell };
