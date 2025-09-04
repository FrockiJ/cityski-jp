import React from 'react';
import { alpha, Box, useTheme } from '@mui/material';

import { StyledLabel } from './styles';

export interface CoreLabelProps extends React.ComponentPropsWithoutRef<typeof Box> {
	color?: 'default' | 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
	children: React.ReactNode;
}

const CoreLabel = ({ children, color = 'default', sx }: CoreLabelProps) => {
	const theme = useTheme();

	const colorSettings = {
		default: {
			text: theme.palette.text.primary,
			background: alpha(theme.palette.text.quaternary, 0.16),
		},
		primary: {
			text: theme.palette.primary.dark,
			background: alpha(theme.palette.primary.main, 0.16),
		},
		secondary: {
			text: theme.palette.secondary.dark,
			background: alpha(theme.palette.secondary.main, 0.16),
		},
		error: {
			text: theme.palette.error.dark,
			background: alpha(theme.palette.error.main, 0.16),
		},
		warning: {
			text: theme.palette.warning.dark,
			background: alpha(theme.palette.warning.main, 0.16),
		},
		info: {
			text: theme.palette.info.dark,
			background: alpha(theme.palette.info.main, 0.16),
		},
		success: {
			text: theme.palette.success.dark,
			background: alpha(theme.palette.success.main, 0.16),
		},
	};

	return (
		<StyledLabel sx={sx} color={colorSettings[color as Exclude<CoreLabelProps['color'], undefined>]}>
			{children}
		</StyledLabel>
	);
};

export default CoreLabel;
