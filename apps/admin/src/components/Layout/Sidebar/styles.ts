import { alpha, Box, Button, styled } from '@mui/material';

interface StyledNavItemProps {
	name: string;
	path?: string;
	subNavItem?: boolean;
	active?: boolean;
	expand?: boolean;
}

const StyledSidebar = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'isSidebarOpen',
})<{ isSidebarOpen?: boolean }>(({ theme, isSidebarOpen }) => ({
	flexShrink: 0,
	width: 280,
	borderRight: `1px solid ${alpha(theme.palette.text.quaternary, 0.24)}`,
	transition: '0.2s',
	position: 'relative',
	...(isSidebarOpen && { marginLeft: -260 }),
}));

const StyledLogoWrapper = styled('div')({
	cursor: 'pointer',
	flex: '0 0 76px',
	display: 'flex',
	justifyContent: 'flex-start',
	alignItems: 'center',
	padding: '0 32px',
});

const SidebarFooter = styled('div')(({ theme }) => ({
	...theme.typography.caption,
	color: theme.palette.text.quaternary,
	padding: '12px 16px',
}));

const StyledLogo = styled('div', {
	shouldForwardProp: (prop) => prop !== 'absolute',
})<{ absolute?: boolean }>(({ theme, absolute }) => ({
	display: 'flex',
	flexDirection: 'column',
	// conditional styles
	...(absolute && {
		position: 'absolute',
		top: 20,
		left: 20,
		zIndex: 4,
	}),
	// responsive styles
	[theme.breakpoints.down('md')]: {
		justifyContent: 'center',
	},
}));

const StyledNav = styled('nav')({
	flex: 1,
	padding: '0 16px',
	'& ul': {
		margin: 0,
		padding: 0,
		width: '100%',
		'& li': {
			width: '100%',
			listStyle: 'none',
			cursor: 'pointer',
			marginBottom: 4,
		},
	},
});

const NavItemGroupName = styled('p')(({ theme }) => ({
	color: theme.palette.text.secondary,
	padding: '24px 0 8px 16px',
	fontWeight: 700,
	fontSize: 11,
	lineHeight: '18px',
}));

const NavItemWrapper = styled('li')({
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'center',
	alignItems: 'center',
});

const StyledNavItem = styled(Button, {
	shouldForwardProp: (prop) => prop !== 'active' && prop !== 'expand' && prop !== 'subNavItem',
})<StyledNavItemProps>(({ theme, active, subNavItem }) => ({
	'&.MuiButtonBase-root': {
		...theme.typography.body2,
		padding: subNavItem ? '13px 12px 13px 16px' : '12px 12px 12px 19px',
		textTransform: 'none',
		color: theme.palette.text.secondary,
		borderRadius: 8,
	},
	...(active && {
		color: `${theme.palette.primary.main} !important`,
		fontWeight: '600 !important',
		backgroundColor: `${alpha(theme.palette.primary.main, 0.08)} !important`,
	}),
}));

const NavItemLink = styled('span', {
	shouldForwardProp: (prop) => prop !== 'subNavItem' && prop !== 'active',
})<{ subNavItem?: boolean; active?: boolean }>(({ theme, subNavItem, active }) => ({
	textAlign: 'left',
	// conditional styles
	...(subNavItem && {
		position: 'relative',
		paddingLeft: 40,
		margin: 0,
		...(active && {
			color: theme.palette.text.primary,
			fontWeight: 600,
		}),

		'&:before': {
			content: '""',
			position: 'absolute',
			top: '50%',
			left: '0',
			transform: 'translateY(-50%)',
			margin: '0 10px',
			width: 4,
			height: 4,
			transition: '.2s',
			backgroundColor: theme.palette.text.secondary,
			borderRadius: '50%',
			...(active && {
				margin: '0 8px',
				width: 8,
				height: 8,
				backgroundColor: theme.palette.primary.main,
			}),
		},
	}),
}));

const StyledSubNav = styled('div')({
	height: 'fit-content',
	display: 'flex',
	flexDirection: 'column',
	width: '100%',
	padding: '4px 0',
	gap: 4,
});

const StyledIconWrapper = styled('div')(({ theme }) => ({
	cursor: 'pointer',
	position: 'absolute',
	display: 'flex',
	alignItems: 'center',
	padding: 4,
	borderRadius: 50,
	top: 20,
	right: -17,
	zIndex: 2,
	backgroundColor: theme.palette.primary.key,
	border: '1px solid rgba(145, 158, 171, 0.24)',
	transition: 'all 0.4s',

	'&:hover': {
		color: theme.palette.primary.main,
		borderColor: alpha(theme.palette.primary.main, 0.5),
	},
}));

const StyleLogoText = styled(Box)(({ theme }) => ({
	...theme.typography.body2,
	color: theme.palette.text.primary,
	marginTop: 10,
}));

export {
	NavItemLink,
	NavItemGroupName,
	NavItemWrapper,
	SidebarFooter,
	StyledLogoWrapper,
	StyledLogo,
	StyledNav,
	StyledNavItem,
	StyledSidebar,
	StyledSubNav,
	StyledIconWrapper,
	StyleLogoText,
};
