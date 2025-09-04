import { alpha, Box, InputBase, styled } from '@mui/material';

export const StyledSearch = styled(Box)(({ theme }) => ({
	display: 'flex',
	alignItems: 'center',
	position: 'relative',
	borderRadius: theme.shape.borderRadius,
	backgroundColor: alpha(theme.palette.common.white, 0.15),
	minWidth: 250,

	'&:hover': {
		backgroundColor: alpha(theme.palette.common.white, 0.25),
	},
}));

export const StyledSearchBarWrapper = styled('div')(({ theme }) => ({
	padding: '8px 8px 8px 14px',
	fontSize: 16,
	fontFamily: 'Noto Sans',
	fontWeight: 400,
	lineHeight: '24px',
	color: theme.palette.text.primary,
	border: '1px solid rgba(145, 158, 171, 0.32)',
	borderRadius: 8,
	height: 40,
	display: 'flex',
	alignItems: 'center',
	svg: {
		color: '#919EAB',
	},
}));

export const StyledInputBase = styled(InputBase)(({ theme }) => ({
	width: '100%',
	textOverflow: 'ellipsis',

	'& .MuiInputBase-input': {
		padding: '0 0 0 5px',
		// vertical padding + font size from searchIcon
		// paddingLeft: `calc(1em + ${theme.spacing(4)})`,
		transition: theme.transitions.create('width'),
		width: '100%',
	},
}));
