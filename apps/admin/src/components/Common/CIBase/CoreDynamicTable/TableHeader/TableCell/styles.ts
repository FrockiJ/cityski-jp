import { alpha, styled } from '@mui/material';

import { DARK_GREY } from '@/shared/constants/colors';

const StyledTitleWrapper = styled('div')<{ isEnd?: boolean; isSort?: boolean }>(({ theme, isEnd, isSort }) => ({
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
	gap: '8px',
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

const StyledDivider = styled('div')({
	position: 'absolute',
	top: '20px',
	bottom: '20px',
	left: '0',
	width: '2px',
	backgroundColor: alpha(DARK_GREY, 0.2),
});

export { StyledTitleWrapper, StyledDivider };
