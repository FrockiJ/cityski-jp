import { alpha, Menu, MenuProps, styled } from '@mui/material';

export const StyledMenu = styled(Menu)<Partial<MenuProps>>(({ theme, anchorOrigin }) => ({
	'& .MuiPaper-root': {
		borderRadius: 12,
		marginTop: theme.spacing(1),
		minWidth: 150,
		color: theme.palette.text.primary,
		boxShadow: '-20px 20px 40px -4px rgba(145, 158, 171, 0.24)',
		filter: 'drop-shadow(0px 0px 2px rgba(145, 158, 171, 0.24))',
		overflow: 'inherit',
		...(anchorOrigin?.vertical === 'top' && {
			marginTop: -8,
		}),
		...(anchorOrigin?.vertical === 'center' && {
			marginTop: '0',
		}),
		...(anchorOrigin?.vertical === 'bottom' && {
			marginTop: 8,
		}),
		'& .MuiMenu-list': {
			padding: '0',
		},
		'& .MuiMenuItem-root': {
			fontSize: 14,
			margin: 8,
			borderRadius: 8,
			'&:hover': {
				backgroundColor: alpha(theme.palette.text.quaternary, 0.08),
			},
			'& .MuiSvgIcon-root': {
				marginRight: theme.spacing(1.5),
			},
			'&:active': {
				backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity),
			},
			svg: {
				marginRight: 18,
			},
		},
		'& .MuiDivider-root': {
			padding: 0,
			'&:after': {
				backgroundColor: alpha(theme.palette.text.quaternary, 0.24),
			},
		},
	},
}));

export const MenuArrow = styled('span', {
	shouldForwardProp: (prop) => prop !== 'transformOrigin' && prop !== 'anchorOrigin',
})<Partial<MenuProps>>(({ anchorOrigin, transformOrigin }) => ({
	position: 'absolute',
	display: 'block',
	width: 12,
	height: 12,
	backgroundColor: '#FFF',
	transform: 'rotate(-135deg)',
	...(anchorOrigin?.vertical === 'top' &&
		transformOrigin?.vertical === 'top' && {
			top: 16,
		}),
	...(anchorOrigin?.vertical === 'top' &&
		transformOrigin?.vertical === 'bottom' && {
			bottom: -14,
		}),
	...(anchorOrigin?.vertical === 'center' &&
		transformOrigin?.vertical === 'center' && {
			top: 'calc(50% - 6px)',
		}),
	...(anchorOrigin?.vertical === 'bottom' &&
		transformOrigin?.vertical === 'top' && {
			top: -14,
		}),
	...(anchorOrigin?.vertical === 'bottom' &&
		transformOrigin?.vertical === 'bottom' && {
			bottom: 16,
		}),
	...(anchorOrigin?.horizontal === 'left' &&
		transformOrigin?.horizontal === 'left' && {
			left: 16,
		}),
	...(anchorOrigin?.horizontal === 'left' &&
		transformOrigin?.horizontal === 'right' && {
			right: -6,
		}),
	...(anchorOrigin?.horizontal === 'center' &&
		transformOrigin?.horizontal === 'center' && {
			right: 'calc(50% - 6px)',
		}),
	...(anchorOrigin?.horizontal === 'right' &&
		transformOrigin?.horizontal === 'right' && {
			right: 18,
		}),
	...(anchorOrigin?.horizontal === 'right' &&
		transformOrigin?.horizontal === 'left' && {
			left: -6,
		}),
}));
