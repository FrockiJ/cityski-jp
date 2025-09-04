import { alpha, Input, lighten, Pagination, styled, TableCell, TableHead, TableRow } from '@mui/material';

import { GREY } from '@/shared/constants/colors';

import { TableCellProps } from './TableBody/TableCell';
import { TableRowProps } from './TableBody/TableRow';
import { TableHeaderProps } from './TableHeader';

const StyledTableHeader = styled(TableHead, {
	shouldForwardProp: (prop) => prop !== 'selectable',
})<Partial<TableHeaderProps>>(({ theme, selectable }) => ({
	backgroundColor: theme.palette.grey['200'],
	'& .MuiTableCell-root': {
		position: 'relative',
		padding: '16px 12px',
		border: 'none',
		'&:first-of-type': {
			padding: '16px 24px',
		},
		...(selectable && {
			'&:first-of-type': {
				padding: '0px 16px',
			},
		}),
	},
}));

const StyledTableRow = styled(TableRow, {
	shouldForwardProp: (prop) => prop !== 'isDragging' && prop !== 'linkTo' && prop !== 'clickable',
})<Partial<TableRowProps> & { isDragging?: boolean; clickable?: boolean }>(
	({ theme, linkTo, isDragging, clickable }) => ({
		...theme.typography.body2,
		background: theme.palette.primary.key,
		borderBottom: `1px solid ${theme.palette.primary.key}`,
		'&:hover': {
			cursor: linkTo || clickable ? 'pointer' : 'default',
			'& td': {
				backgroundColor: lighten(GREY, 0.95),
				'&.sticky-left:before': {
					background: `linear-gradient(90deg, ${lighten(GREY, 0.95)} 0%,rgba(255,255,255,0) 100%)`,
				},
				'&.sticky-right:before': {
					background: `linear-gradient(270deg, ${lighten(GREY, 0.95)} 0%,rgba(255,255,255,0) 100%)`,
				},
			},
		},
		'&.Mui-selected': {
			backgroundColor: 'initial',
			'& td': {
				backgroundColor: lighten(theme.palette.primary.main, 0.9),
				'&.sticky-left:before': {
					background: `linear-gradient(90deg, ${lighten(theme.palette.primary.main, 0.9)} 0%,rgba(255,255,255,0) 100%)`,
				},
				'&.sticky-right:before': {
					background: `linear-gradient(270deg, ${lighten(theme.palette.primary.main, 0.9)} 0%,rgba(255,255,255,0) 100%)`,
				},
			},
		},
		...(isDragging && {
			borderRadius: '4px',
			boxShadow: `3px 3px 6px ${alpha(GREY, 0.6)}`,
			' td': {
				background: '#f7f8f9',
			},
		}),
	}),
);

const StyledTableCell = styled(TableCell, {
	shouldForwardProp: (prop) =>
		prop !== 'sticky' &&
		prop !== 'isLeftRange' &&
		prop !== 'stickyOffset' &&
		prop !== 'isDragging' &&
		prop !== 'selectable' &&
		prop !== 'draggable',
})<
	TableCellProps & {
		isLeftRange?: boolean;
		stickyOffset?: number;
		selectable?: boolean;
	}
>(({ theme, sticky, isLeftRange, stickyOffset, isDragging, selectable, draggable }) => ({
	position: 'relative',
	padding: '15px 8px',
	wordBreak: 'break-word',
	'&:first-of-type': {
		padding: '0px 8px 0px 24px',
	},
	...(draggable && {
		'&:first-of-type': {
			padding: '0 12px 0 16px',
		},
	}),
	...(selectable && {
		'&:first-of-type': {
			padding: '0px 16px',
		},
	}),
	'&:after': {
		content: "''",
		position: 'absolute',
		left: 0,
		bottom: 0,
		width: '100%',
		background: 'rgba(0, 0, 0, 0.1)',
	},
	...(sticky && {
		position: 'sticky',
		zIndex: 1,
		background: theme.palette.background.default,
		'&:before': {
			content: "''",
			position: 'absolute',
			zIndex: -1,
			top: 0,
			...(isLeftRange ? { left: '100%' } : { right: '100%' }),
			width: '10px',
			height: 'calc(100% - 1px)',
			pointerEvents: 'none',
			mixBlendMode: 'overlay',
			background: isLeftRange
				? 'linear-gradient(90deg, rgba(255,255,255,1) 0%,rgba(255,255,255,0) 100%)'
				: 'linear-gradient(270deg, rgba(255,255,255,1) 0%,rgba(255,255,255,0) 100%)',
		},
		...(isLeftRange ? { left: stickyOffset } : { right: stickyOffset }),
	}),
	...(isDragging && {
		position: 'initial',
		'&:after': {},
	}),
}));

const StyledPagination = styled(Pagination)(({ theme }) => ({
	'& .MuiPagination-ul': {
		'& >li': {
			'&:not(:first-of-type):not(:last-of-type)': {
				display: 'none',
			},
		},
	},
	'& .MuiPaginationItem-root': {
		height: '36px',
		width: '36px',
		color: theme.palette.text.primary,
		border: 'none',
		margin: '0px 6px',
		borderRadius: '50%',
		'&:disabled': {
			color: theme.palette.text.disabled,
		},
	},
	'& .Mui-selected': {
		backgroundColor: `${theme.palette.primary.main} !important`,
		color: `${theme.palette.text.tertiary} !important`,
	},
	'& .MuiPaginationItem-ellipsis': {
		height: '32px',
		width: '32px',
		borderRadius: '4px',
		textAlign: 'bottom',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
	},
}));

const StyledPaginationSelect = styled(Input)({
	'& .MuiInputBase-input': {
		borderRadius: 4,
		position: 'relative',
		fontSize: 14,
		minWidth: '16px',
		padding: '4px 24px 4px 8px',
		outline: 'none',
		'&:focus': {},
	},
});

const StyledTableTitle = styled('div')({
	fontSize: '24px',
	fontWeight: 700,
	lineHeight: '36px',
});

const StyledTableWrapper = styled('div')(() => ({
	boxShadow: '0px 12px 24px -4px rgba(145, 158, 171, 0.12), 0px 0px 2px 0px rgba(145, 158, 171, 0.20)',
	borderRadius: '16px',
}));

const StyledTableBreadcrumbsWrapper = styled('div')({
	display: 'inline-flex',
	justifyContent: 'center',
	alignItems: 'center',
	marginBottom: '24px',
	marginTop: '8px',
});

type StyledTableBreadcrumbsItemProps = {
	first: boolean;
};
const StyledTableBreadcrumbsItem = styled('div')<StyledTableBreadcrumbsItemProps>(({ first, theme }) => ({
	fontSize: '14px',
	color: first ? theme.palette.text.primary : theme.palette.text.quaternary,
}));

const StyledTableBreadcrumbsDot = styled('div')(({ theme }) => ({
	height: '4px',
	width: '4px',
	borderRadius: '50%',
	backgroundColor: theme.palette.text.quaternary,
	margin: '0 16px',
}));

export {
	StyledPagination,
	StyledPaginationSelect,
	StyledTableHeader,
	StyledTableRow,
	StyledTableCell,
	StyledTableTitle,
	StyledTableWrapper,
	StyledTableBreadcrumbsWrapper,
	StyledTableBreadcrumbsItem,
	StyledTableBreadcrumbsDot,
};
