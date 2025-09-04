import { Alert, Box, styled, Typography } from '@mui/material';

import { WHITE } from '@/shared/constants/colors';

export const StyledMain = styled(Box, {
	shouldForwardProp: (props) => props !== 'infoRight',
})<{ infoRight?: boolean }>(({ infoRight }) => ({
	marginLeft: 244, // anchor nav width 228 + gap 16
	width: infoRight ? 800 + 24 + 246 : 800, // 246 先固定
}));

export const StyledContentWrapper = styled(Box)({
	width: '100%',
	margin: 'auto',
	padding: '24px 76px',
	// height: height,
	// height: '2800px', // should change to last block + hv
	display: 'flex',
	justifyContent: 'center',
});

export const StyledBlockWrapper = styled(Box)({
	display: 'flex',
	// height: '2000px'
});

export const StyledBlock = styled(Box, {
	shouldForwardProp: (props) => props !== 'isPlaceholder' && props !== 'isError',
})<{ isPlaceholder?: boolean; isError?: boolean }>(({ theme, isPlaceholder, isError }) => ({
	...(!isPlaceholder && {
		scrollMarginTop: '24px', // anchor offset top
		width: '100%',
		boxShadow: '0px 1px 2px rgba(145, 158, 171, 0.16)',
		borderRadius: '16px',
		background: '#fff',
		padding: '24px',
		margin: '0 0 24px 0',
		border: `1px solid transparent`,
		transition: 'all ease 0.3s',
	}),
	...(isError && {
		border: `1px solid ${theme.palette.error.main}`,
	}),
}));

export const StyledBlockHeader = styled(Box)(({ theme }) => ({
	marginBottom: 24,
	width: '100%',
	display: 'flex',
	justifyContent: 'space-between',
	alignItems: 'center',
	color: theme.palette.secondary.main,
	fontWeight: 600,
	fontFamily: 'Noto Sans',
}));

export const StyledBlockContent = styled(Box)(({ theme }) => ({
	width: '100%',
	display: 'flex',
	alignItems: 'center',
	color: theme.palette.secondary.main,
	fontFamily: 'Noto Sans',
	padding: '24px 0 0 0',
}));

export const StyledTitle = styled(Typography)(({ theme }) => ({
	display: 'flex',
	color: theme.palette.secondary.main,
	fontWeight: 700,
	fontSize: 18,
	lineHeight: '28px',
}));

export const StyledAnchorNavWrapper = styled(Box)({
	position: 'absolute',
});

export const StyledAnchorItem = styled('a', {
	shouldForwardProp: (props) => props !== 'isChecked' && props !== 'active',
})<{ active?: boolean; isChecked?: boolean }>(({ theme, active }) => ({
	display: 'block',
	position: 'relative',
	color: active ? theme.palette.primary.main : theme.palette.text.secondary,
	fontWeight: active ? 600 : 400,
	fontSize: 14,
	padding: '7px 0 7px 26px',
	cursor: 'pointer',
	'&:before': {
		position: 'absolute',
		left: 0,
		top: 0,
		bottom: 0,
		margin: 'auto',
		content: '""',
		border: `2px solid ${theme.palette.text.secondary}`,
		width: 14,
		height: 14,
		borderRadius: '50%',
		zIndex: 2,
		transition: '0.2s',
		background: '#FFF',
		...(active && {
			border: `2px solid ${theme.palette.primary.main}`,
		}),
	},
	'& ~ a:after': {
		position: 'absolute',
		left: 6,
		bottom: '50%',
		content: '""',
		width: 2,
		height: '100%',
		background: '#C4CDD5',
		zIndex: 1,
	},
}));

export const StyledCheckedAnchorItem = styled(Box, {
	shouldForwardProp: (props) => props !== 'isChecked',
})<{ isChecked?: boolean }>(({ isChecked }) => ({
	transition: '0.2s',
	opacity: isChecked ? 1 : 0,
	content: '""',
	width: 5,
	height: 7,
	borderRadius: '5%',
	borderBottom: `2px solid ${WHITE}`,
	borderRight: `2px solid ${WHITE}`,
	transform: 'rotate(45deg)',
	position: 'absolute',
	top: 12,
	left: 5,
	transformOrigin: 'left',
	zIndex: 3,
}));

export const StyledAlert = styled(Alert, {
	shouldForwardProp: (props) => props !== 'isChecked',
})<{
	isChecked?: boolean;
}>(() => ({
	opacity: 1,
	transition: 'opacity 0.5s',
	marginBottom: 24,
	borderRadius: 8,
	background: '#FF5555',
	color: '#FF5630',
}));

export const StyledRow = styled(Box)(({ row }: { row?: boolean }) => ({
	display: 'flex',
	width: '100%',
	'&:not(:last-child)': {
		marginBottom: row ? 0 : '24px',
	},
}));

// Modal Content Styles
export const StyledHeaderTitle = styled(Typography)(({ theme }) => ({
	display: 'flex',
	color: theme.palette.primary.basic,
	fontWeight: 700,
	fontSize: '18px',
	lineHeight: '28px',
}));
