import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Box } from '@mui/material';
import { TableType } from '@repo/shared';

import { StyledWrapper } from './styles';
interface TableFooterProps {
	type: TableType;
}

const TableFooter = ({}: TableFooterProps) => {
	return (
		<Box position='relative'>
			{/* <CorePagination type={type} /> */}
			<StyledWrapper>
				View all <ArrowForwardIosIcon fontSize='small' />
			</StyledWrapper>
		</Box>
	);
};

export default TableFooter;
