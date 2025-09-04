import { Chip, styled, Theme } from '@mui/material';

import CoreTableCell from '../CoreTableCell';

export const StyledEditCoreTableCell = styled(CoreTableCell)({
	color: 'blue',
	cursor: 'pointer',
});

export const StyledCoreTableCell = styled(CoreTableCell, {
	shouldForwardProp: (prop) => prop !== 'lineHeight',
})<{ lineHeight?: number }>(({ lineHeight }) => ({
	width: 52,
	lineHeight: lineHeight,
}));

export const StyledImg = styled('img')({
	objectFit: 'contain',
	width: 64,
	height: 36,
	borderRadius: 4,
});

export const StyledChip = styled(Chip, {
	shouldForwardProp: (prop) => prop !== 'customColor' && prop !== 'customBackgroundColor',
})<{ customColor?: string; customBackgroundColor?: string | ((theme: Theme) => string) }>(
	({ theme, customColor, customBackgroundColor }) => ({
		fontSize: 12,
		fontWeight: 700,
		lineHeight: '20px',
		borderRadius: 6,
		height: 20,
		color: customColor,
		backgroundColor: typeof customBackgroundColor === 'function' ? customBackgroundColor(theme) : customBackgroundColor,
	}),
);
