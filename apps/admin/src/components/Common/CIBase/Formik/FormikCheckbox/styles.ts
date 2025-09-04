import { styled, TableCell } from '@mui/material';

export const StyledFormControl = styled(TableCell)<{ width?: string; margin?: string }>(
	({ width = '100%', margin = '0 0 20px 0' }) => ({
		width,
		margin,
		maxWidth: '100%',
	}),
);
