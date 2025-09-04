import { Box, BoxProps } from '@mui/material';
import { OrderByType } from '@repo/shared';

import ArrowIcon from '@/Icon/ArrowIcon';

interface SortProps extends BoxProps {
	sort: OrderByType | null;
}

const Sort = ({ sort, sx, ...props }: SortProps) => {
	return (
		<Box
			sx={{
				display: 'flex',
				alignItems: 'center',
				...sx,
			}}
			{...props}
		>
			<ArrowIcon direction={sort === OrderByType.asc ? 'up' : 'down'} sx={{ fontSize: '16px' }} />
		</Box>
	);
};

export default Sort;
