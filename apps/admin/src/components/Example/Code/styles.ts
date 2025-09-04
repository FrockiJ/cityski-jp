import { Box } from '@mui/material';
import { styled } from '@mui/material';

const StyledCodeWrapper = styled(Box)(({ theme }) => ({
	backgroundColor: theme.palette.grey[800],
	padding: '16px',
	margin: '16px 0',
	borderRadius: '8px',
	'& pre': {
		fontSize: '14px',
		color: 'white',
	},
}));

export { StyledCodeWrapper };
