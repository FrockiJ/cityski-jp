import { Box, styled } from '@mui/material';

const StyledDrawerTitle = styled('div')({
	display: 'flex',
	justifyContent: 'space-between',
	alignItems: 'center',
	padding: '17px 10px 17px 24px',
	fontWeight: 600,
	boxShadow: '0px -1px 0px 0px #919EAB3D inset',
});

const StyledNav = styled('nav')(({ theme }) => ({
	width: 280,
	height: 'calc(100% - 68px - 88px)',
	overflowY: 'auto',
	marginRight: 2,
	...theme.mixins.scrollbar,
}));

const StyledContent = styled('div')({
	padding: '24px 20px',
});

const StyledResultWrapper = styled('div')(({ theme }) => ({
	marginTop: 20,
	fontSize: 14,
	color: theme.palette.text.primary,
}));

const StyledResultCount = styled('span')(({ theme }) => ({
	fontWeight: 600,
	color: theme.palette.text.primary,
	marginRight: 4,
}));

const StyledFilterConditionItem = styled('div')(() => ({
	display: 'flex',
	flexDirection: 'row',
	alignItems: 'stretch',
	border: '1px solid #919EAB52',
	borderRadius: 8,
	overflow: 'hidden',
}));

const StyledFilterConditionCategory = styled('div')(({ theme }) => ({
	display: 'flex',
	alignItems: 'center',
	color: theme.palette.text.secondary,
	background: theme.palette.background.light,
	fontSize: 13,
	fontWeight: 600,
	paddingLeft: 6,
	paddingRight: 6,
	borderRight: '1px solid #919EAB52',
	whiteSpace: 'nowrap',
}));

const StyledFilterConditionItemName = styled('div')(({ theme }) => ({
	color: theme.palette.text.primary,
	borderRadius: 50,
	backgroundColor: '#919EAB29',
	fontSize: 13,
	fontWeight: 400,
	paddingLeft: 8,
	whiteSpace: 'nowrap',
}));

const StyledTitle = styled(Box)(() => ({
	fontSize: '16px',
	lineHeight: '24px',
	fontWeight: 600,
	marginBottom: 8,
}));

const StyledFilterWrapper = styled(Box)(() => ({
	display: 'flex',
	alignItems: 'center',
	gap: 16,
}));

const StyledFilterConditionWrapper = styled(Box)(() => ({
	display: 'flex',
	alignItems: 'center',
	gap: '8px',
	flexWrap: 'wrap',
	margin: 8,
}));

const StyledClearButtonWrapper = styled(Box)(() => ({
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
	flex: '1',
	padding: '0 24px',
}));

export {
	StyledDrawerTitle,
	StyledFilterConditionCategory,
	StyledFilterConditionItem,
	StyledFilterConditionItemName,
	StyledNav,
	StyledContent,
	StyledResultCount,
	StyledResultWrapper,
	StyledTitle,
	StyledFilterWrapper,
	StyledFilterConditionWrapper,
	StyledClearButtonWrapper,
};
