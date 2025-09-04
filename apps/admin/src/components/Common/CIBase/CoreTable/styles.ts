import {
	alpha,
	Input,
	lighten,
	Pagination,
	styled,
	TableCell,
	TableContainer,
	TableContainerProps,
	TableHead,
	TableRow,
} from '@mui/material';

import { DARK, GREY } from '@/shared/constants/colors';

import { CoreTableCellProps } from './CoreTableBody/CoreTableCell';
import { CoreTableRowProps } from './CoreTableBody/CoreTableRow';
import { TableContainerAnimated } from './table_demo_styles';
import { TableHeaderProps } from './TableHeader';

const StyledTableHeader = styled(TableHead, {
	shouldForwardProp: (prop) => prop !== 'selectable',
})<Partial<TableHeaderProps>>(({ theme, selectable }) => ({
	backgroundColor: theme.mode === 'dark' ? theme.palette.grey['900'] : theme.palette.grey['200'],
	'& .MuiTableCell-root': {
		position: 'relative',
		padding: '17px 8px',
		border: 'none',
		'&:first-of-type': {
			padding: '17px 8px 17px 24px',
		},
		...(selectable && {
			'&:first-of-type': {
				padding: '0px 16px',
			},
		}),
	},
}));

const StyledTableRow = styled(TableRow, {
	shouldForwardProp: (prop) => prop !== 'isDragging',
})<Partial<CoreTableRowProps> & { isDragging?: boolean }>(({ theme, linkto, isDragging }) => ({
	...theme.typography.body2,
	background: theme.palette.primary.key,
	'&:hover': {
		cursor: linkto ? 'pointer' : 'default',
		'& td': {
			backgroundColor: theme.mode === 'dark' ? lighten(DARK, 0.1) : lighten(GREY, 0.95),
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
}));

const StyledTableCell = styled(TableCell, {
	shouldForwardProp: (prop) =>
		prop !== 'sticky' &&
		prop !== 'isLeftRange' &&
		prop !== 'stickyOffset' &&
		prop !== 'isDragging' &&
		prop !== 'selectable' &&
		prop !== 'draggable' &&
		prop !== 'hasClick' &&
		prop !== 'isChildrenTypeObject',
})<
	CoreTableCellProps & {
		isLeftRange?: boolean;
		stickyOffset?: number;
		selectable?: boolean;
		hasClick?: boolean;
		isChildrenTypeObject?: boolean;
	}
>(
	({
		theme,
		sticky,
		isLeftRange,
		stickyOffset,
		isDragging,
		selectable,
		draggable,
		isChildrenTypeObject,
		width,
		hasClick,
	}) => ({
		borderBottom: 'none',
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
			// height: '1px',
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
		...(width && { width }),
		...(isChildrenTypeObject && {
			padding: '24px 8px',
		}),
		...(hasClick && {
			cursor: 'pointer',
			color: 'secondary.main',
		}),
	}),
);

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

const StyledTableContainerAnimated = styled(TableContainerAnimated, {
	shouldForwardProp: (prop) => prop !== 'height',
})<{ height?: number | string }>(({ height }) => ({
	height,
	borderRadius: 0,
}));

interface StyledTableContainerProps extends TableContainerProps {
	component: any;
	elevation: number;
	height?: number | string;
}
const StyledTableContainer = styled(TableContainer, {
	shouldForwardProp: (prop) => prop !== 'height',
})<StyledTableContainerProps>(({ height }) => ({
	height,
	borderRadius: 0,
}));

export {
	StyledPagination,
	StyledPaginationSelect,
	StyledTableHeader,
	StyledTableRow,
	StyledTableCell,
	StyledTableContainerAnimated,
	StyledTableContainer,
};
