import { Box } from '@mui/material';
import { styled } from '@mui/material';

export const StyledButtonWrapper = styled(Box)(() => ({
	display: 'flex',
	justifyContent: 'flex-end',
	width: '100%',
	gap: '12px',
}));

export const StyledRow = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'header',
})<{ header?: boolean }>(({ theme, header }) => ({
	display: 'flex',
	flexDirection: 'row',
	borderBottom: `1px solid ${theme.palette.grey['300']}`,
	...(header && {
		backgroundColor: theme.palette.grey['200'],
		borderBottom: 'none',
	}),
}));

export const StyledCell = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'header' && prop !== 'hasDiv',
})<{ header?: boolean; width?: string; hasDiv?: boolean }>(({ theme, header, width, hasDiv = true }) => ({
	flex: width ? `0 1 ${width}` : 1,
	padding: '17px 8px',
	color: theme.palette.text.primary,
	wordBreak: 'break-word',
	lineHeight: '22px',
	...(header && {
		color: theme.palette.text.secondary,
		fontWeight: 'bold',
		position: 'relative',
		fontSize: 14,
		...(hasDiv && {
			'&:before': {
				content: '""',
				position: 'absolute',
				top: 20,
				bottom: 20,
				left: -2,
				width: 2,
				backgroundColor: theme.palette.grey['300'],
			},
		}),
	}),
}));
