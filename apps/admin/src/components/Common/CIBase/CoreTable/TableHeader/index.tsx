import { useEffect, useState } from 'react';
import { TableCell as MuiTableCell, TableRow } from '@mui/material';
import { OrderByType } from '@repo/shared';

import { CoreCheckbox } from '@/CIBase/CoreCheckboxGroup';

import { StyledTableHeader } from '../styles';

import { StyledMuiTableCell } from './styles';
import TableCell, { CellItem } from './TableCell';

export interface TableHeaderProps {
	headerCells: { name: string; width?: string | number; sort?: boolean; end?: boolean }[] | null;
	defaultOrderBy?: string;
	defaultOrder?: OrderByType;
	selectable?: boolean;
	handleChecked?: (checked: boolean) => void;
	isChecked?: boolean;
	isIndeterminate?: boolean;
	draggable?: boolean;
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
					{draggable && <StyledMuiTableCell />}
					{headerCells &&
						headerCells.map((cellItem: CellItem, index: number) => (
							<TableCell
								key={index}
								cellItem={cellItem}
								index={selectable ? index + 1 : index}
								defaultOrderBy={defaultOrderBy}
								defaultOrder={defaultOrder}
								unspecifiedWidthCount={headerCells.filter(({ width }) => !width).length}
							/>
						))}
				</>
			</TableRow>
		</StyledTableHeader>
	);
};

export default TableHeader;
