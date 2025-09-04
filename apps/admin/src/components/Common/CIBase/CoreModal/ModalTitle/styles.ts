import { styled } from '@mui/material';
import IconButton from '@mui/material/IconButton';

export const StyledIconButton = styled(IconButton)<{ noTitleBorder?: boolean }>(({ theme }) => ({
	position: 'absolute',
	right: '12px',
	top: '20px',
	color: theme.palette.grey[500],
}));
