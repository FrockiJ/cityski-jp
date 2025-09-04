import { useEffect, useState } from 'react';
import { TableCell } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';

import CoreButton from '@/CIBase/CoreButton';
import CoreTableRow from '@/CIBase/CoreTable/CoreTableBody/CoreTableRow';
import { ColumnType } from '@/shared/constants/enums';
import { ListResultI, TableConfig } from '@/shared/types/dynamicTable';

import { ColumnContent } from '../CoreTableBody/CoreTableRow/ColumnContent';

import { StyledManageTableCell } from './styles';

interface MoreOption {
	label: string;
	onClick: (id: string) => void;
}

interface CoreTableListProps<T extends ListResultI> {
	rows: T[];
	tableConfig: TableConfig<T>;
	selectable?: boolean;
	selected?: readonly string[];
	setSelected?: React.Dispatch<React.SetStateAction<readonly string[]>>;
	handleManage?: (id: string) => void;
	handleDelete?: (id: string) => void;
	refetch?: () => void;
	draggable?: boolean;
}

export function CoreTableList<T extends ListResultI>(props: CoreTableListProps<T>) {
	const {
		rows,
		tableConfig,
		// selectable = false,
		handleManage,
		handleDelete,
		// selected,
		// setSelected,
		refetch,
		draggable,
	} = props;

	// const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	// const open = Boolean(anchorEl);

	// const [clickRowId, setClickRowId] = useState<string>();

	// const handleClick = (event: React.MouseEvent<HTMLElement>) => {
	// 	setAnchorEl(event.currentTarget);
	// };
	// const handleClose = () => {
	// 	setAnchorEl(null);
	// };

	const [, setMoreOptions] = useState<MoreOption[]>([]);

	// const handleSelectClick = (event: React.MouseEvent<unknown> | React.SyntheticEvent, id: string) => {
	// 	if (!selected || !setSelected) return;
	// 	const selectedIndex = selected?.indexOf(id);
	// 	let newSelected: readonly string[] = [];

	// 	if (selectedIndex === -1) {
	// 		newSelected = newSelected.concat(selected, id);
	// 	} else if (selectedIndex === 0) {
	// 		newSelected = newSelected.concat(selected.slice(1));
	// 	} else if (selectedIndex === selected.length - 1) {
	// 		newSelected = newSelected.concat(selected.slice(0, -1));
	// 	} else if (selectedIndex > 0) {
	// 		newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
	// 	}

	// 	setSelected(newSelected);
	// };

	// const isSelected = (id: string) => (selected ? selected.indexOf(id) !== -1 : false);

	useEffect(() => {
		const tempOptions: MoreOption[] = [];
		if (handleManage) {
			tempOptions.push({ label: 'Manage', onClick: handleManage });
		}
		if (handleDelete) {
			tempOptions.push({ label: 'Delete', onClick: handleDelete });
		}
		setMoreOptions(tempOptions);
	}, [handleManage, handleDelete]);

	return (
		<>
			{rows.map((row, rowIndex) => (
				<CoreTableRow
					key={rowIndex}
					{...(draggable && {
						draggable,
						draggableId: row.id,
						draggableIndex: rowIndex,
					})}
				>
					{tableConfig?.columns
						.filter((column) => column.type)
						.map((column) => (
							<ColumnContent
								row={row}
								column={column}
								index={rowIndex}
								handleDelete={handleDelete}
								refetch={refetch}
								key={column.entityKey ?? String(column.key) ?? uuidv4}
							/>
						))}

					{handleManage && <StyledManageTableCell>編輯</StyledManageTableCell>}
					{handleDelete && !tableConfig.columns?.find((c) => c.type === ColumnType.DELETE) && (
						<TableCell>
							<CoreButton variant='text' label='Delete' onClick={() => handleDelete(row.id)} />
						</TableCell>
					)}
				</CoreTableRow>
			))}
		</>
	);
}
