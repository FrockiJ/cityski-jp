import { useEffect } from 'react';
import { Box, TableCell as MuiTableCell, TableCellProps as MuiTableCellProps } from '@mui/material';
import { OrderByType, SortType } from '@repo/shared';

import Sort from '@/CIBase/CoreDynamicTable/TableHeader/Sort';
import { ListResultI, TableColumn } from '@/shared/types/dynamicTable';
import { setTableSort } from '@/state/slices/tableSlice';
import { useAppDispatch, useAppSelector } from '@/state/store';

import { StyledDivider, StyledTitleWrapper } from './styles';

interface TableCellProps<T extends ListResultI> {
	cellItem: TableColumn<T>;
	handleSort?: (sort: SortType) => void;
	sort?: SortType;
}

interface TableCellProps<T> extends MuiTableCellProps {
	cellItem: TableColumn<T>;
	index: number;
	defaultOrderBy?: string;
	defaultOrder?: OrderByType;
	unspecifiedWidthCount?: number;
	hideAllSort?: boolean;
}

const TableCell = ({
	cellItem,
	index,
	defaultOrderBy,
	defaultOrder = OrderByType.desc,
	unspecifiedWidthCount = 1,
	hideAllSort,
	...props
}: TableCellProps<ListResultI>) => {
	const dispatch = useAppDispatch();
	const tableSort = useAppSelector((state) => state.table.tableSort);

	useEffect(() => {
		return () => {
			dispatch(
				setTableSort({
					order: null,
					orderBy: '',
				}),
			);
		};
	}, [dispatch]);

	return (
		<MuiTableCell
			sx={{
				...(!cellItem.width
					? {
							width: `${100 / unspecifiedWidthCount}%`,
						}
					: {
							minWidth: cellItem.width,
							maxWidth: cellItem.width,
							width: cellItem.width,
						}),
			}}
			{...props}
		>
			<StyledTitleWrapper
				isEnd={cellItem.end}
				isSort={!hideAllSort && cellItem.sort}
				// has sort feature
				{...(!hideAllSort &&
					cellItem.sort && {
						onClick: () => {
							const isDesc =
								tableSort.orderBy === (cellItem.key || cellItem.name) && tableSort.order === OrderByType.desc;
							dispatch(
								setTableSort({
									orderBy: cellItem.key || cellItem.name,
									order: tableSort.order
										? isDesc
											? OrderByType.asc
											: OrderByType.desc
										: (cellItem.key || cellItem.name) === defaultOrderBy && defaultOrder === OrderByType.desc
											? OrderByType.asc
											: OrderByType.desc,
								}),
							);
						},
					})}
			>
				{/* divider */}
				{index > 0 && <StyledDivider />}
				{/* th title */}
				<Box sx={{ whiteSpace: 'nowrap' }}>{cellItem.name}</Box>
				{/* sort icon */}
				{!hideAllSort &&
				cellItem.sort &&
				(tableSort.orderBy === (cellItem.key || cellItem.name) ||
					(!tableSort.orderBy && (cellItem.key || cellItem.name) === defaultOrderBy)) ? (
					<Sort sort={tableSort.order || defaultOrder} color='primary.main' />
				) : (
					!hideAllSort && cellItem.sort && <Sort className='sortWrapper' sort={OrderByType.desc} />
				)}
			</StyledTitleWrapper>
		</MuiTableCell>
	);
};

export default TableCell;
