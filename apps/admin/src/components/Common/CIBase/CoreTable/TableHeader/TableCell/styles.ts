import { alpha, Box, styled, TableCell } from '@mui/material';

import { DARK_GREY } from '@/shared/constants/colors';

export const StyledTitleWrapper = styled('div')<{ isEnd?: boolean; isSort?: boolean }>(({ theme, isEnd, isSort }) => ({
	...theme.typography.subtitle2,
	color: DARK_GREY,
	display: 'flex',
	justifyContent: isEnd ? 'flex-end' : 'normal',
	cursor: isSort ? 'pointer' : 'default',
	userSelect: 'none',
	mozUserSelect: 'none',
	khtmlUserSelect: 'none',
	webkitUserSelect: 'none',
	oUserSelect: 'none',
	gap: 8,
	...(isSort && {
		'& .sortWrapper': {
			transition: '150ms',
			opacity: 0,
		},
		'&:hover': {
			'& .sortWrapper': {
				opacity: 0.6,
			},
		},
	}),
}));

export const StyledDivider = styled(Box)({
	position: 'absolute',
	top: 20,
	bottom: 20,
	left: 0,
	width: 2,
	backgroundColor: alpha(DARK_GREY, 0.2),
});

export const StyledName = styled(Box)({
	whiteSpace: 'nowrap',
});

export const StyledMuiTableCell = styled(TableCell, {
	shouldForwardProp: (props) => props !== 'minWidth',
})<{ minWidth?: string | number; width?: string | number }>(({ minWidth, width }) => ({
	minWidth,
	width,
}));
