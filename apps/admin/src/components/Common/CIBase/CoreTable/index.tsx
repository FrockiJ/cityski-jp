import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd';
import { Paper, Table as MuiTable, TableBody } from '@mui/material';
import { OrderByType, TableType } from '@repo/shared';

import CoreLoaders from '@/CIBase/CoreLoaders';
import CoreScrollbar from '@/CIBase/CoreScrollbar';
import TableHeader from '@/CIBase/CoreTable/TableHeader';
import { useAnimations } from '@/hooks/useAnimations';
import { setTablePageManager } from '@/state/slices/tableSlice';
import { useAppDispatch, useAppSelector } from '@/state/store';

import NoData from './CoreTableBody/NoData';
import { StyledTableContainer } from './styles';
import { renderHeader } from './tableConfig';
import TableFooter from './TableFooter';

interface CoreTableProps {
	id: string;
	type: TableType;
	isLoading?: boolean;
	hideTableFooter?: boolean;
	selectable?: boolean;
	handleCheckedList?: (ids: string[]) => void;
	draggable?: boolean;
	handleDragEnd?: (result: DropResult) => void;
	height?: number | string;
	children?: React.ReactNode;
	dataCount?: number;
	pageResetDeps?: any;
	defaultOrderBy?: string;
	defaultOrder?: OrderByType;
	headData?: {
		name: string;
		width?: string | number | undefined;
		sort?: boolean | undefined;
		end?: boolean | undefined;
	}[];
}

/**
 * Table Component
 * --
 * @description
 *  1. Table is a component that accepts your own customized list as its children
 *		 please look at the CustomList component as an example.
 *	2. The table header is separate from the table list, applying a 'type' prop
 *		 to the Table component will determine which type of table header to use
 *	3. You define your table header in the tableConfig.ts file,
 *	   use enum to register that header type for that header in enums.ts
 */
const CoreTable = ({
	type,
	isLoading,
	hideTableFooter = false,
	selectable = false,
	handleCheckedList,
	draggable = false,
	handleDragEnd,
	// height = 'initial',
	children,
	dataCount = 0,
	pageResetDeps = [],
	defaultOrderBy,
	defaultOrder,
	headData,
}: CoreTableProps) => {
	const dispatch = useAppDispatch();
	const tablePageManager = useAppSelector((state) => state.table.tablePageManager);
	const { animate, fadeIn } = useAnimations();
	const AnimatedTableBody = animate(TableBody);

	// selectable checkbox list
	const [checkedList, setCheckedList] = useState<string[]>([]);
	const [ids, setIds] = useState<string[]>([]);

	const handleCheckedItem = (rowId: string) => (checked: boolean) => {
		if (checked) setCheckedList?.([...checkedList, rowId]);
		else setCheckedList?.(checkedList.filter((id) => id !== rowId));
	};

	const handleCheckedAll = (checked: boolean) => {
		if (checked) {
			const newIds = Array.from(new Set([...checkedList, ...ids]));
			setCheckedList?.(newIds);
		} else {
			const newIds = checkedList.filter((id) => !ids.includes(id));
			setCheckedList?.(newIds);
		}
	};

	const handleGetIds = (ids?: string[]) => {
		setIds(ids || []);
	};

	useEffect(() => {
		handleCheckedList?.(checkedList);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [checkedList]);

	// draggable
	const onDragEnd = (result: DropResult) => {
		if (!result.destination) return;
		handleDragEnd?.(result);
	};

	useEffect(() => {
		dispatch(
			setTablePageManager({
				...tablePageManager,
				[`table${type}`]: {
					...tablePageManager[`table${type}`],
					currentPage: 1,
				},
			}),
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [...pageResetDeps]);

	return (
		<>
			<StyledTableContainer component={Paper} elevation={0}>
				<CoreScrollbar>
					<MuiTable aria-label='table'>
						<TableHeader
							headerCells={headData ? headData : type ? renderHeader(type) : []}
							defaultOrderBy={defaultOrderBy}
							defaultOrder={defaultOrder}
							selectable={selectable}
							handleChecked={handleCheckedAll}
							isChecked={ids.every((id) => checkedList.includes(id))}
							isIndeterminate={ids.some((id) => checkedList.includes(id))}
							draggable={draggable}
						/>
						{!isLoading &&
							(draggable ? (
								<DragDropContext onDragEnd={onDragEnd}>
									<Droppable droppableId='droppable'>
										{(provided) => (
											<AnimatedTableBody style={fadeIn} {...provided.droppableProps} ref={provided.innerRef}>
												{dataCount > 0 ? (
													<>
														{React.cloneElement(children as React.ReactElement, {
															selectable,
															handleGetIds,
															handleCheckedItem,
															checkedList,
															draggable,
														})}
														{provided.placeholder}
													</>
												) : (
													<NoData />
												)}
											</AnimatedTableBody>
										)}
									</Droppable>
								</DragDropContext>
							) : (
								<AnimatedTableBody style={fadeIn}>
									{dataCount > 0 ? (
										React.cloneElement(children as React.ReactElement, {
											selectable,
											handleGetIds,
											handleCheckedItem,
											checkedList,
										})
									) : (
										<NoData />
									)}
								</AnimatedTableBody>
							))}
					</MuiTable>
				</CoreScrollbar>
				{isLoading && <CoreLoaders sx={{ minHeight: '300px' }} />}
			</StyledTableContainer>
			{!hideTableFooter && dataCount > 0 && <TableFooter type={type} />}
		</>
	);
};

export default CoreTable;
