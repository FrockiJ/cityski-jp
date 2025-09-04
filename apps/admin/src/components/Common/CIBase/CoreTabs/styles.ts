import { styled, Tab } from '@mui/material';

const StyledTab = styled(Tab)(({ theme }) => ({
	...theme.typography.subtitle2,
	padding: '0px',
	minWidth: '48px',
	color: theme.palette.text.secondary,
	'&.Mui-selected': {
		color: theme.palette.text.primary,
	},
}));

export { StyledTab };
