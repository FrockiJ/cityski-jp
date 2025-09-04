import { Box } from '@mui/material';
import { styled } from '@mui/material';

const StyledRow = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'header',
})<{ header?: boolean }>(({ theme, header }) => ({
	display: 'flex',
	flexDirection: 'row',
	borderBottom: `2px solid ${theme.palette.grey['200']}`,
	...(header && {
		backgroundColor: theme.palette.grey['200'],
	}),
}));

const StyledCell = styled(Box, {
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
		fontSize: '14px',
		...(hasDiv && {
			'&:before': {
				content: '""',
				position: 'absolute',
				top: '20px',
				bottom: '20px',
				left: '-2px',
				width: '2px',
				backgroundColor: theme.palette.grey['300'],
			},
		}),
	}),
}));

const StyledWrapper = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'marginLeft',
})<{ marginLeft: string }>(({ marginLeft }) => ({
	display: 'flex',
	justifyContent: 'flex-start',
	marginLeft,
}));

const StyledToolBar = styled(Box)(() => ({
	marginTop: '26px',
	marginBottom: '20px',
	display: 'flex',
	justifyContent: 'space-between',
	alignItems: 'center',
}));

const StyledMsg = styled(Box)(({ theme }) => ({
	color: theme.palette.error.main,
	fontSize: '12px',
	fontWeight: '400',
	marginLeft: '12px',
}));

const StyledExpand = styled(Box)(({ theme }) => ({
	...theme.typography.body2,
	cursor: 'pointer',
	color: 'secondary.main',
}));

const StyleLine = styled(Box)(({ theme }) => ({
	width: '2px',
	height: '16px',
	backgroundColor: theme.palette.grey[400],
}));

const StyledActionWrapper = styled(Box)(() => ({
	display: 'flex',
	alignItems: 'center',
	gap: '12px',
}));

export { StyledRow, StyledCell, StyledWrapper, StyledToolBar, StyledMsg, StyledExpand, StyleLine, StyledActionWrapper };
