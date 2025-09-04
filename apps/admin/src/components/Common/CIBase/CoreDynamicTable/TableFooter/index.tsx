import { Box, TablePagination } from '@mui/material';

import { setTablePageManager } from '@/state/slices/tableSlice';
import { useAppDispatch, useAppSelector } from '@/state/store';

interface TableFooterProps {
	count: number;
	id: string;
}

const TableFooter = ({ count, id }: TableFooterProps) => {
	const dispatch = useAppDispatch();
	const tablePageManager = useAppSelector((state) => state.table.tablePageManager);

	const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => {
		dispatch(
			setTablePageManager({
				...tablePageManager,
				[`table${id}`]: {
					...tablePageManager[`table${id}`],
					currentPage: page,
				},
			}),
		);
	};

	const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		dispatch(
			setTablePageManager({
				...tablePageManager,
				[`table${id}`]: {
					currentPage: 0,
					currentPerPage: Number(event.target.value),
				},
			}),
		);
	};

	return (
		<Box position='relative'>
			<TablePagination
				component='div'
				rowsPerPageOptions={[5, 10, 25, 50]}
				count={count}
				page={!count || count <= 0 ? 0 : tablePageManager[`table${id}`]?.currentPage || 0}
				onPageChange={handleChangePage}
				rowsPerPage={tablePageManager[`table${id}`]?.currentPerPage || 10}
				labelRowsPerPage='每頁幾筆'
				onRowsPerPageChange={handleChangeRowsPerPage}
				labelDisplayedRows={({ from, to, count }) => {
					const adjustedFrom = from === 0 ? 0 : from;
					const adjustedTo = to === 0 ? 0 : to;
					return `${adjustedFrom}–${adjustedTo} / ${count !== -1 ? count : `more than ${to}`}`;
				}}
			/>
		</Box>
	);
};

export default TableFooter;
