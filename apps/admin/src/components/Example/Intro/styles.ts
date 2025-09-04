import { Box } from '@mui/material';
import { styled } from '@mui/material';

const StyledContentWrapper = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'noBackground',
})<{ noBackground?: boolean }>(({ theme, noBackground }) => ({
	'& li': {
		marginBottom: '4px',
	},
	...(!noBackground && {
		backgroundColor: theme.palette.grey[100],
		width: '100%',
		margin: '20px 20px 20px 0',
		padding: '10px 20px',
		borderLeft: `5px solid ${theme.palette.primary.basic}`,
		borderRadius: '5px',
	}),
}));

export { StyledContentWrapper };
