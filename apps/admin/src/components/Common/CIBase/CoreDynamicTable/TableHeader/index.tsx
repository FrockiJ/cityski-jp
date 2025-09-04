import { useEffect, useState } from 'react';
import { TableCell as MuiTableCell, TableRow } from '@mui/material';
import { OrderByType } from '@repo/shared';

import { CoreCheckbox } from '@/CIBase/CoreCheckboxGroup';
import TableCell from '@/CIBase/CoreDynamicTable/TableHeader/TableCell';
import { ListResultI, TableColumn } from '@/shared/types/dynamicTable';

import { StyledTableHeader } from '../styles';

export interface TableHeaderProps {
	headerCells: { name: string; width?: string | number; sort?: boolean; end?: boolean }[] | null;
	defaultOrderBy?: string;
	defaultOrder?: OrderByType;
	selectable?: boolean;
	handleChecked?: (checked: boolean) => void;
	isChecked?: boolean;
	isIndeterminate?: boolean;
	draggable?: boolean;
	hideAllSort?: boolean;
}

const TableHeader = ({
	headerCells,
	defaultOrderBy,
	defaultOrder,
	selectable,
	handleChecked,
	isChecked = false,
	isIndeterminate = false,
	draggable,
	hideAllSort,
}: TableHeaderProps) => {
	const [checked, setChecked] = useState(isChecked);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setChecked(e.target.checked);
		handleChecked?.(e.target.checked);
	};

	useEffect(() => {
		setChecked(isChecked);
	}, [isChecked]);

	return (
		<StyledTableHeader selectable={selectable}>
			<TableRow>
				<>
					{selectable && (
						<MuiTableCell>
							<CoreCheckbox onChange={handleChange} checked={checked} indeterminate={!checked && isIndeterminate} />
						</MuiTableCell>
					)}
					{draggable && <MuiTableCell sx={{ minWidth: '52px' }} />}
					{headerCells &&
						headerCells.map((cellItem: TableColumn<ListResultI>, index: number) => (
							<TableCell
								key={index}
								cellItem={cellItem}
								index={selectable ? index + 1 : index}
								defaultOrderBy={defaultOrderBy}
								defaultOrder={defaultOrder}
								unspecifiedWidthCount={headerCells.filter(({ width }) => !width).length}
								hideAllSort={hideAllSort}
							/>
						))}
				</>
			</TableRow>
		</StyledTableHeader>
	);
};

export default TableHeader;
