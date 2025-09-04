import {
	alpha,
	Box,
	Button as MuiButton,
	List as MuiList,
	ListItem as MuiListItem,
	ListItemText as MuiListItemText,
	styled,
} from '@mui/material';
import { FilterType } from '@repo/shared';

export const FormikFrom = styled('form')({
	marginTop: 40,
	borderRadius: 16,
	boxShadow: '0px 12px 24px -4px #919EAB1F, 0px 0px 2px 0px #919EAB33',
});

export const DrawerTitle = styled('div')({
	display: 'flex',
	justifyContent: 'space-between',
	alignItems: 'center',
	padding: '17px 10px 17px 24px',
	fontWeight: 600,
	boxShadow: '0px -1px 0px 0px #919EAB3D inset',
});

export const Nav = styled('nav')(({ theme }) => ({
	width: 280,
	height: 'calc(100% - 68px - 70px)',
	overflowY: 'auto',
	marginRight: 2,
	...theme.mixins.scrollbar,
}));

export const List = styled(MuiList)(() => ({
	padding: 0,
}));

export const ListItem = styled(MuiListItem, {
	shouldForwardProp: (props) => props !== 'type',
})<{ type?: FilterType }>(({ type }) => ({
	padding: '0 20px',
	marginTop: type !== FilterType.DATETIME_END ? 24 : 12,
	flexDirection: 'column',
	justifyContent: 'flex-start',
	alignItems: 'flex-start',
}));

export const ListItemText = styled(MuiListItemText)(() => ({
	display: 'flex',
	width: '100%',

	'& .MuiTypography-root': {
		color: '#212B36',
		fontWeight: 600,
		marginBottom: 8,
	},
}));

export const Button = styled(MuiButton)((props) => {
	if (props['aria-label'] === 'Add') {
		return {
			height: 36,
			borderRadius: 8,
		};
	}

	if (props['aria-label'] === 'Filter') {
		return {
			display: 'flex',
			color: props.theme.palette.secondary.main,
		};
	}

	if (props['aria-label'] === 'Clear') {
		return {
			fontSize: 13,
			fontWeight: 700,
			color: props.theme.palette.error.main,
		};
	}

	if (props['aria-label'] === 'DrawerClear') {
		return {
			display: 'flex',
			width: 230,
			position: 'absolute',
			left: 25,
			bottom: 20,
			fontSize: 15,
			fontWeight: 700,
			color: props.theme.palette.secondary.main,
			border: `1px solid ${alpha(props.theme.palette.text.quaternary, 0.32)}`,
			borderRadius: 8,
			padding: '10px 0',
		};
	}

	if (props['aria-label'] === 'Manage' || props['aria-label'] === 'Edit') {
		return {
			color: '#3366FF',
		};
	}

	if (props['aria-label'] === 'Co-Owner') {
		return {
			fontSize: 14,
			fontWeight: 700,
			marginRight: 8,
			borderRadius: 8,
		};
	}

	if (props['aria-label'] === 'Cancel') {
		return {
			borderRadius: 8,
		};
	}

	if (props['aria-label'] === 'Confirm') {
		return {
			borderRadius: 8,
		};
	}
});

export const ResultWrapper = styled('div')((props) => ({
	padding: '10px 0',
	fontSize: 14,
	fontFamily: 'Noto Sans',
	color: props.theme.palette.secondary.main,
}));

export const ResultCount = styled('span')((props) => ({
	fontWeight: 600,
	color: props.theme.palette.secondary.main,
	marginRight: 4,
}));

export const StyledFilterConditionItem = styled('div')(({ theme }) => ({
	display: 'inline-flex',
	flexDirection: 'row',
	alignItems: 'center',
	border: `1px solid ${alpha(theme.palette.text.quaternary, 0.32)}`,
	borderRadius: 8,
	marginRight: 10,
	marginBottom: 10,
	height: 44,
	overflow: 'hidden',
}));

export const FilterConditionCategory = styled('div')(({ theme }) => ({
	display: 'flex',
	height: '100%',
	alignItems: 'center',
	color: theme.palette.text.secondary,
	background: alpha(theme.palette.text.quaternary, 0.24),
	fontSize: 13,
	fontWeight: 600,
	paddingLeft: 6,
	paddingRight: 6,
	borderRight: `1px solid ${alpha(theme.palette.text.quaternary, 0.32)}`,
	whiteSpace: 'nowrap',
}));

export const StyledFilterConditionItemName = styled('div')(({ theme }) => ({
	display: 'flex',
	color: theme.palette.text.primary,
	borderRadius: 50,
	backgroundColor: '#919EAB29',
	fontSize: 13,
	fontWeight: 400,
	paddingLeft: 8,
	margin: '0 8px',
	whiteSpace: 'nowrap',
}));

export const CoOwner = styled('div')(() => ({
	display: 'inline-flex',
	background: 'rgba(145, 158, 171, 0.16)',
	borderRadius: 50,
	padding: '3px 8px',
	marginRight: 6,
	marginBottom: 6,
	whiteSpace: 'nowrap',
}));

export const MoreButtonOverlay = styled('div')(() => ({
	position: 'absolute',
	top: 0,
	left: -10,
	width: '100%',
	height: '100%',
	background: '#fff',
	filter: 'blur(10px)',
}));

export const StyledTableWrapBorder = styled(Box)(() => ({
	overflow: 'auto',
	borderRadius: 16,
	boxShadow: '0px 0px 2px rgba(145, 158, 171, 0.2), 0px 12px 24px -4px rgba(145, 158, 171, 0.12)',
	marginTop: 40,
}));

export const StyledSearchFilterWrapper = styled(Box)(() => ({
	display: 'flex',
	justifyContent: 'space-between',
	alignItems: 'center',
	height: 'auto',
	padding: '20px 24px',
}));

export const StyledFilterSearchWrapper = styled(Box)(() => ({
	display: 'flex',
	alignItems: 'center',
	'> *:not(:last-child)': { marginRight: '16px' },
}));

export const StyledTruncateText = styled(Box)(() => ({
	whiteSpace: 'nowrap',
	overflow: 'hidden',
	textOverflow: 'ellipsis',
	maxWidth: '70%',
}));
