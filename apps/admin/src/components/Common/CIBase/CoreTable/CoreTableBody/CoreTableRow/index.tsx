import React, { useEffect, useRef, useState } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { useRouter } from 'next/router';

import { CoreCheckbox } from '@/CIBase/CoreCheckboxGroup';
import { StyledTableRow } from '@/CIBase/CoreTable/styles';
import DragIcon from '@/Icon/DragIcon';

import { StyledCoreTableCell } from './styles';

export interface CoreTableRowProps {
	children: any;
	selectable?: boolean;
	handleChecked?: (checked: boolean) => void;
	controlChecked?: boolean;
	draggable?: boolean;
	draggableId?: string; //only required when draggable to true
	draggableIndex?: number; //only required when draggable to true
	linkto?: string;
}

const CoreTableRow = ({
	children,
	selectable,
	handleChecked,
	controlChecked = false,
	draggable,
	draggableId,
	draggableIndex = 0,
	linkto,
}: CoreTableRowProps) => {
	const router = useRouter();
	const [checked, setChecked] = useState(false);
	const rowRef = useRef<HTMLTableRowElement | null>(null);

	const handleRowClick = (e: any) => {
		if (e.target.tagName !== 'INPUT') {
			linkto && router.push(`${router.pathname}/${linkto.toLowerCase()}`);
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
							linkto={linkto}
							onClick={handleRowClick}
							// draggable props
							ref={(el: HTMLTableRowElement | null) => {
								provided.innerRef(el);
								rowRef.current = el;
							}}
							{...provided.draggableProps}
							isDragging={snapshot.isDragging}
						>
							<StyledCoreTableCell
								{...provided.dragHandleProps}
								lineHeight={0}
								draggable
								isDragging={snapshot.isDragging}
							>
								<DragIcon color='action' />
							</StyledCoreTableCell>
							{selectable && (
								<StyledCoreTableCell selectable>
									<CoreCheckbox onChange={handleChange} checked={checked} />
								</StyledCoreTableCell>
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
				<StyledTableRow ref={rowRef} selected={checked} linkto={linkto} onClick={handleRowClick}>
					{selectable && (
						<StyledCoreTableCell selectable>
							<CoreCheckbox onChange={handleChange} checked={checked} />
						</StyledCoreTableCell>
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

export default CoreTableRow;
