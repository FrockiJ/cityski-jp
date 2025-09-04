import { useEffect, useState } from 'react';
import { MoreOption, TableConfig } from '@repo/shared';

import MoreCell from '@/CIBase/CoreDynamicTable/MoreCell';
import TableRow from '@/CIBase/CoreDynamicTable/TableBody/TableRow';
import ColumnContent from '@/CIBase/CoreDynamicTable/TableBody/TableRow/ColumnContent';
import { ListResultI } from '@/shared/types/dynamicTable';

interface TableListProps<T extends ListResultI> {
	rows: T[];
	tableConfig: TableConfig<T>;
	selectable?: boolean;
	selected?: readonly string[];
	setSelected?: React.Dispatch<React.SetStateAction<readonly string[]>>;
	handleEdit?: (id: string, rowData: T) => void;
	handleDelete?: (id: string, rowData: T) => void;
	handleSwitch?: (id: string, rowData: T) => void;
	handleRefresh?: () => void;
	handleTableRowClick?: (rowData: T) => void;
	draggable?: boolean;
	noSticky?: boolean;
	linkTo?: string;
}

const CoreDynamicTableList = <T extends ListResultI>(props: TableListProps<T>) => {
	const {
		rows,
		tableConfig,
		// selectable = false,
		handleEdit,
		handleDelete,
		handleSwitch,
		// selected,
		// setSelected,
		draggable,
		noSticky,
		linkTo,
		handleTableRowClick,
	} = props;
	const [moreOptions, setMoreOptions] = useState<MoreOption[]>([]);

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

		if (handleEdit) {
			tempOptions.push({ label: '編輯', onClick: handleEdit, isDisabled: false });
		}
		if (handleDelete) {
			tempOptions.push({ label: '刪除', onClick: handleDelete });
		}

		setMoreOptions(tempOptions);
	}, [handleEdit, handleDelete]);

	return (
		<>
			{rows.map((row, rowIndex) => (
				<TableRow
					key={rowIndex}
					linkTo={linkTo}
					rowData={row}
					handleTableRowClick={handleTableRowClick}
					{...(draggable && {
						draggable,
						draggableId: row.id,
						draggableIndex: rowIndex,
					})}
				>
					{tableConfig?.columns
						.filter((column) => column.type)
						.map((column, index) => (
							<ColumnContent
								key={index}
								row={row}
								column={column}
								index={rowIndex}
								handleEdit={handleEdit}
								handleDelete={handleDelete}
								handleSwitch={handleSwitch}
							/>
						))}
					{!noSticky && moreOptions.length > 0 && <MoreCell rowData={row} moreOptions={moreOptions} />}
				</TableRow>
			))}
		</>
	);
};

export default CoreDynamicTableList;
