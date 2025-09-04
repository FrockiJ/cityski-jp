import { styled } from '@mui/material';

const BreadcrumbList = styled('ol')(({ theme }) => ({
	display: 'flex',
	alignItems: 'center',
	listStyle: 'none',
	gap: '16px',
	padding: 0,
	margin: 0,
	'& li': {
		...theme.typography.body2,
	},
}));

const BreadcrumbLink = styled('span', {
	shouldForwardProp: (prop) => prop !== 'isCurrent',
})<{ isCurrent: boolean }>(({ theme, isCurrent }) => ({
	color: theme.palette.text.primary,
	...(isCurrent && {
		color: theme.palette.grey[500],
	}),
}));

const BreadcrumbDivider = styled('div')(({ theme }) => ({
	width: '4px',
	height: '4px',
	backgroundColor: theme.palette.grey[500],
	borderRadius: '50%',
}));

export { BreadcrumbList, BreadcrumbLink, BreadcrumbDivider };
