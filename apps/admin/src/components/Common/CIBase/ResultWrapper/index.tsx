import { Typography } from '@mui/material';

interface ResultWrapperProps {
	count: number;
}
export const ResultWrapper = ({ count }: ResultWrapperProps) => {
	return (
		<Typography color='initial' variant='body2' sx={{ padding: '10px 0' }}>
			{count} 筆結果被找到
		</Typography>
	);
};
