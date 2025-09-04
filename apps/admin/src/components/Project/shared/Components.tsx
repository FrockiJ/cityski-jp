import React from 'react';
import InfoIcon from '@mui/icons-material/Info';
import { alpha, Box, styled, SxProps, Typography } from '@mui/material';

import { PRIMARY_MAIN_TRANSPARENT } from '@/shared/constants/colors';

export const StyledCell = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'header' && prop !== 'hasDiv' && prop !== 'dense',
})<{ header?: boolean; width?: string; hasDiv?: boolean; dense?: boolean }>(
	({ theme, header, width, hasDiv = true, dense = false }) => ({
		display: 'flex',
		alignItems: 'center',
		flex: width ? `0 1 ${width}` : 1,
		padding: dense ? '8px' : '17px 8px',
		color: theme.palette.text.primary,
		wordBreak: 'break-word',
		lineHeight: '22px',
		fontSize: 14,
		...(header && {
			padding: '17px 8px',
			color: theme.palette.text.secondary,
			fontWeight: 'bold',
			position: 'relative',
			...(hasDiv && {
				'&:before': {
					content: '""',
					position: 'absolute',
					top: 20,
					bottom: 20,
					left: -2,
					width: 2,
					backgroundColor: theme.palette.grey[300],
				},
			}),
		}),
	}),
);

const StyledRow = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'header',
})<{ header?: boolean }>(({ theme, header }) => ({
	display: 'flex',
	flexDirection: 'row',
	borderBottom: `1px solid ${theme.palette.grey[300]}`,
	...(header && {
		backgroundColor: theme.palette.grey[200],
		borderBottom: 'none',
	}),
}));

export const Row = ({
	children,
	header = false,
	tableHeader,
	sx,
}: {
	children: React.ReactNode;
	header?: boolean;
	tableHeader?: { label: string; width: string }[];
	sx?: SxProps;
}) => {
	return (
		<StyledRow header={header} sx={sx}>
			{React.Children.map(children, (child, index) => {
				if (React.isValidElement(child)) {
					const isStyledCell = child.type === StyledCell;
					const additionalProps = isStyledCell ? { hasDiv: index > 0 && tableHeader && tableHeader[index]?.label } : {};

					return React.cloneElement(child as React.ReactElement, additionalProps);
				}
				return child;
			})}
		</StyledRow>
	);
};

export const MessageHint = ({ color, message }: { color: 'primary' | 'info' | 'error'; message?: string }) => {
	return (
		<Box
			sx={{
				display: 'flex',
				alignItems: 'center',
				borderRadius: 2,
				padding: '0 14px',
				transition: 'all ease 0.3s',
				margin: '0 0 24px 0',
				backgroundColor: `${color}.lighter`,
				height: 52,
				...(color === 'primary' && {
					backgroundColor: alpha(PRIMARY_MAIN_TRANSPARENT, 0.12),
				}),
			}}
		>
			<InfoIcon color={color} />
			<Typography variant='body2' color={`${color}.darker`} sx={{ ml: 1 }}>
				{message}
			</Typography>
		</Box>
	);
};

export const StyledAdornment = styled('div', {
	shouldForwardProp: (prop) => prop !== 'type',
})<{ type: 'start' | 'end' }>(({ theme, type }) => ({
	display: 'flex',
	color: theme.palette.text.quaternary,
	whiteSpace: 'nowrap',

	...(type === 'start' && {
		marginRight: 10,
		paddingRight: 10,
		borderRight: `1px solid ${alpha(theme.palette.text.quaternary, 0.32)}`,
	}),
	...(type === 'end' && {
		marginLeft: 10,
		paddingLeft: 10,
		borderLeft: `1px solid ${alpha(theme.palette.text.quaternary, 0.32)}`,
	}),
}));
