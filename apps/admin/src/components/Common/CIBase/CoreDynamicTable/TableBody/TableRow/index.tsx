import React, { useEffect, useRef, useState } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { useRouter } from 'next/router';

import { CoreCheckbox } from '@/CIBase/CoreCheckboxGroup';
import TableCell from '@/CIBase/CoreDynamicTable/TableBody/TableCell';
import DragIcon from '@/Icon/DragIcon';

import { StyledTableRow } from '../../styles';

export interface TableRowProps {
	children: any;
	selectable?: boolean;
	handleChecked?: (checked: boolean) => void;
	controlChecked?: boolean;
	draggable?: boolean;
	draggableId?: string; //only required when draggable to true
	draggableIndex?: number; //only required when draggable to true
	linkTo?: string;
	rowData: any;
	handleTableRowClick?: (rowData: any) => void;
}

const TableRow = ({
	children,
	selectable,
	handleChecked,
	controlChecked = false,
	draggable,
	draggableId,
	draggableIndex = 0,
	linkTo,
	rowData,
	handleTableRowClick,
}: TableRowProps) => {
	const router = useRouter();

	const [checked, setChecked] = useState(false);
	const rowRef = useRef<HTMLTableRowElement | null>(null);

	const handleRowClick = (event: React.MouseEvent) => {
		if (linkTo && rowData && (event.currentTarget as HTMLTableElement).tagName === 'TR') {
			router.push({
				pathname: linkTo,
			});
		}

		if (
			handleTableRowClick &&
			rowData &&
			(event.currentTarget as HTMLTableElement).tagName === 'TR' &&
			(event.target as HTMLInputElement).type !== 'checkbox' &&
			!(event.target as HTMLInputElement).className.includes('MuiSwitch-track')
		) {
			handleTableRowClick(rowData);
		}
	};

	// checkbox
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setChecked(e.target.checked);
		handleChecked?.(e.target.checked);
	};

	useEffect(() => {
		setChecked(controlChecked);
	}, [controlChecked]);

	return (
		<>
			{draggable ? (
				<Draggable key={draggableId} draggableId={draggableId || `${draggableIndex}`} index={draggableIndex}>
					{(provided, snapshot) => (
						<StyledTableRow
							selected={checked}
							linkTo={linkTo}
							clickable={typeof handleTableRowClick === 'function'}
							onClick={handleRowClick}
							// draggable props
							ref={(el: any) => {
								provided.innerRef(el);
								rowRef.current = el;
							}}
							{...provided.draggableProps}
							isDragging={snapshot.isDragging}
						>
							<TableCell
								{...provided.dragHandleProps}
								sx={{
									width: '52px',
									lineHeight: 0,
								}}
								draggable
								isDragging={snapshot.isDragging}
							>
								<DragIcon color='action' />
							</TableCell>
							{selectable && (
								<TableCell selectable sx={{ width: '56px' }}>
									<CoreCheckbox onChange={handleChange} checked={checked} />
								</TableCell>
							)}
							{React.Children.map(children, (child) =>
								React.isValidElement(child)
									? React.cloneElement(child as React.ReactElement, {
											draggable,
											isDragging: snapshot.isDragging,
											rowRef: rowRef,
										})
									: child,
							)}
						</StyledTableRow>
					)}
				</Draggable>
			) : (
				<StyledTableRow
					ref={rowRef}
					selected={checked}
					linkTo={linkTo}
					clickable={typeof handleTableRowClick === 'function'}
					onClick={handleRowClick}
				>
					{selectable && (
						<TableCell selectable sx={{ width: '56px' }}>
							<CoreCheckbox onChange={handleChange} checked={checked} />
						</TableCell>
					)}
					{React.Children.map(children, (child) =>
						React.isValidElement(child)
							? React.cloneElement(child as React.ReactElement, {
									selectable,
									rowRef: rowRef,
								})
							: child,
					)}
				</StyledTableRow>
			)}
		</>
	);
};

export default TableRow;
