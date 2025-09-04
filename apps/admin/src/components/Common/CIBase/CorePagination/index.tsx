import { Box, PaginationItem, Select, SelectChangeEvent } from '@mui/material';
import { TableType } from '@repo/shared';

import { StyledPagination, StyledPaginationSelect } from '@/CIBase/CoreTable/styles';
import ChevronIcon from '@/Icon/ChevronIcon';
import ExpandIcon from '@/Icon/ExpandIcon';
import { setTableDataPerPage, setTablePageManager } from '@/state/slices/tableSlice';
import { useAppDispatch, useAppSelector } from '@/state/store';

import { StyledExpandIconWrapper, StyledMenuItem } from './styles';

interface CorePaginationProps {
	type: TableType;
}

const CorePagination = ({ type }: CorePaginationProps) => {
	const dispatch = useAppDispatch();
	const tableDataPerPage = useAppSelector((state) => state.table.tableDataPerPage);
	const tablePageManager = useAppSelector((state) => state.table.tablePageManager);
	const tablePagination = useAppSelector((state) => state.table.tablePagination);

	const handleChange = (event: React.ChangeEvent<unknown>, page: number) => {
		dispatch(
			setTablePageManager({
				...tablePageManager,
				[`table${type}`]: {
					...tablePageManager[`table${type}`],
					currentPage: page,
				},
			}),
		);
	};

	const handleChangePerPage = (event: SelectChangeEvent<number>) => {
		dispatch(setTableDataPerPage(+event.target.value));
		dispatch(
			setTablePageManager({
				...tablePageManager,
				[`table${type}`]: {
					...tablePageManager[`table${type}`],
					currentPage: 1,
				},
			}),
		);
	};

	if (!tablePagination) return null;

	const { current_page, current_page_value_from, current_page_value_to, num_values, total_pages } = tablePagination;

	return (
		<Box
			typography='body2'
			width='100%'
			display='flex'
			alignItems='center'
			justifyContent='end'
			gap='24px'
			padding='10px 8px'
		>
			<Box>每頁幾筆</Box>
			<Select
				value={tableDataPerPage}
				onChange={handleChangePerPage}
				input={<StyledPaginationSelect disableUnderline />}
				IconComponent={() => (
					<StyledExpandIconWrapper>
						<ExpandIcon />
					</StyledExpandIconWrapper>
				)}
			>
				<StyledMenuItem value={5}>5</StyledMenuItem>
				<StyledMenuItem value={10}>10</StyledMenuItem>
				<StyledMenuItem value={15}>15</StyledMenuItem>
			</Select>
			<Box>{`${current_page_value_from}-${current_page_value_to} / ${num_values}`}</Box>
			<Box>
				<StyledPagination
					count={total_pages}
					page={current_page}
					onChange={handleChange}
					variant='outlined'
					shape='rounded'
					color='primary'
					renderItem={(item) => (
						<PaginationItem
							slots={{
								previous: () => <ChevronIcon direction='left' fontSize='small' />,
								next: () => <ChevronIcon direction='right' fontSize='small' />,
							}}
							{...item}
						/>
					)}
				/>
			</Box>
		</Box>
	);
};

export default CorePagination;
