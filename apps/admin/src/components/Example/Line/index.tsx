import { Divider, useTheme } from '@mui/material';

interface LineProps {
	color?: string;
	opacity?: number;
	width?: number | string;
	margin?: number | string;
}

const Line = ({ color, opacity = 1, width, margin = '40px 0' }: LineProps) => {
	const theme = useTheme();
	const defaultColor = color || theme.palette.grey[300];
	return <Divider style={{ borderColor: defaultColor, opacity, width, margin }} />;
};

export default Line;
