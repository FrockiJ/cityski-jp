'use client';
import { IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledIconButton = styled(IconButton)<{ noTitleBorder?: boolean }>(({ theme }) => ({
	position: 'absolute',
	right: '12px',
	top: '20px',
	color: theme.palette.grey[500],
}));

export { StyledIconButton };
