import { useEffect } from 'react';
import { TableCellProps as MuiTableCellProps } from '@mui/material';
import { OrderByType } from '@repo/shared';

import Sort from '@/CIBase/CoreTable/TableHeader/Sort';
import { setTableSort } from '@/state/slices/tableSlice';
import { useAppDispatch, useAppSelector } from '@/state/store';

import { StyledDivider, StyledMuiTableCell, StyledName, StyledTitleWrapper } from './styles';

export type CellItem = {
	name: string;
	hiddenName?: boolean;
	width?: string | number;
	sort?: boolean;
	sortValue?: string;
	end?: boolean;
};

interface TableCellProps extends MuiTableCellProps {
	cellItem: CellItem;
	index: number;
	defaultOrderBy?: string;
	defaultOrder?: OrderByType;
	unspecifiedWidthCount?: number;
}

const TableCell = ({
	cellItem,
	index,
	defaultOrderBy,
	defaultOrder = OrderByType.desc,
	unspecifiedWidthCount = 1,
	...props
}: TableCellProps) => {
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
		<StyledMuiTableCell
			minWidth={cellItem.width}
			width={!cellItem.width ? `${100 / unspecifiedWidthCount}%` : ''}
			{...props}
		>
			<StyledTitleWrapper
				isEnd={cellItem.end}
				isSort={cellItem.sort}
				// has sort feature
				{...(cellItem.sort && {
					onClick: () => {
						const isDesc =
							tableSort.orderBy === (cellItem.sortValue || cellItem.name) && tableSort.order === OrderByType.desc;
						dispatch(
							setTableSort({
								orderBy: cellItem.sortValue || cellItem.name,
								order: tableSort.order
									? isDesc
										? OrderByType.asc
										: OrderByType.desc
									: (cellItem.sortValue || cellItem.name) === defaultOrderBy && defaultOrder === OrderByType.desc
										? OrderByType.asc
										: OrderByType.desc,
							}),
						);
					},
				})}
			>
				{/* divider */}
				{index > 0 && cellItem.name && <StyledDivider />}
				{/* th title */}
				<StyledName>{cellItem.name}</StyledName>
				{/* sort icon */}
				{cellItem.sort &&
				(tableSort.orderBy === (cellItem.sortValue || cellItem.name) ||
					(!tableSort.orderBy && (cellItem.sortValue || cellItem.name) === defaultOrderBy)) ? (
					<Sort sort={tableSort.order || defaultOrder} color='primary.main' />
				) : (
					cellItem.sort && <Sort className='sortWrapper' sort={OrderByType.desc} />
				)}
			</StyledTitleWrapper>
		</StyledMuiTableCell>
	);
};

export default TableCell;
