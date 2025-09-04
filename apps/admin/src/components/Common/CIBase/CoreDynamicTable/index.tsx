import React, { ReactNode, useEffect, useState } from 'react';
import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd';
import { Paper, Table as MuiTable, TableBody, TableCell, TableRow } from '@mui/material';
import { OrderByType } from '@repo/shared';

import { useAnimations } from '@/hooks/useAnimations';

import CoreLoaders from '../CoreLoaders';

import NoData from './TableBody/NoData';
import { TableContainerAnimated } from './table_demo_styles';
import TableFooter from './TableFooter';
import TableHeader from './TableHeader';

interface CoreDynamicTableProps {
	id: string;
	isLoading?: boolean;
	isBorderRadius?: boolean;
	hideTableFooter?: boolean;
	selectable?: boolean;
	handleCheckedList?: (ids: string[]) => void;
	draggable?: boolean;
	handleDragEnd?: (result: DropResult) => void;
	height?: number | string;
	children?: ReactNode;
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
	hideAllSort?: boolean;
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
const CoreDynamicTable = ({
	id,
	isLoading,
	isBorderRadius,
	hideTableFooter = false,
	selectable = false,
	handleCheckedList,
	draggable = false,
	handleDragEnd,
	height = 'initial',
	children,
	dataCount = 0,
	defaultOrderBy,
	defaultOrder,
	headData,
	hideAllSort,
}: CoreDynamicTableProps) => {
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

	const renderTableBody = () => {
		switch (true) {
			case !isLoading && draggable:
				return (
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
				);
			case !isLoading && !draggable:
				return (
					<AnimatedTableBody style={fadeIn}>
						{dataCount > 0 ? (
							React.cloneElement(children as React.ReactElement, {
								selectable,
								handleGetIds,
								handleCheckedItem,
								checkedList,
							})
						) : (
							<NoData text='查詢的資料沒有結果' />
						)}
					</AnimatedTableBody>
				);
			case isLoading:
				return (
					<AnimatedTableBody style={fadeIn}>
						<TableRow>
							<TableCell colSpan={headData?.length}>
								<CoreLoaders />
							</TableCell>
						</TableRow>
					</AnimatedTableBody>
				);
			default:
				break;
		}
	};

	return (
		<>
			<TableContainerAnimated
				component={Paper}
				elevation={0}
				sx={(theme) => ({
					height,
					borderRadius: 0,
					...theme.mixins.scrollbar,

					...(isBorderRadius && {
						borderRadius: 4,
					}),
				})}
			>
				<MuiTable aria-label='table'>
					<TableHeader
						headerCells={headData ?? []}
						defaultOrderBy={defaultOrderBy}
						defaultOrder={defaultOrder}
						selectable={selectable}
						handleChecked={handleCheckedAll}
						isChecked={ids.every((id) => checkedList.includes(id))}
						isIndeterminate={ids.some((id) => checkedList.includes(id))}
						draggable={draggable}
						hideAllSort={hideAllSort}
					/>
					{renderTableBody()}
				</MuiTable>
			</TableContainerAnimated>
			{!hideTableFooter && dataCount > 0 && <TableFooter count={dataCount} id={id} />}
		</>
	);
};

export default CoreDynamicTable;
