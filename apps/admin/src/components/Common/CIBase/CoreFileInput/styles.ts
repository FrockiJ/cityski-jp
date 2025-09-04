import { Box, FormControl, styled } from '@mui/material';

const StyledFormControl = styled(FormControl, {
	shouldForwardProp: (prop) => prop !== 'width' && prop !== 'customMargin' && prop !== 'style',
})<{
	width?: string | number;
	customMargin?: string;
	style?: React.CSSProperties;
}>(({ width, customMargin, style }) => ({
	width: width ? width : '100%',
	margin: customMargin ? customMargin : '0',
	...style,
}));

const StyledTitleWrapper = styled(Box)(() => ({
	display: 'flex',
	fontSize: '16px',
	color: 'black',
	marginBottom: '6px',
}));
export { StyledFormControl, StyledTitleWrapper };
