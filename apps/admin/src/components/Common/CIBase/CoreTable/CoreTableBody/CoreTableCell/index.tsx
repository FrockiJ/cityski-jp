import { useEffect, useRef, useState } from 'react';
import { TableCellProps as MuiTableCellProps } from '@mui/material';

import { StyledTableCell } from '@/CIBase/CoreTable/styles';

export interface CoreTableCellProps extends MuiTableCellProps {
	selectable?: boolean;
	draggable?: boolean;
	isDragging?: boolean;
	sticky?: boolean;
	rowRef?: React.MutableRefObject<HTMLTableRowElement | null>;
}

const CoreTableCell = ({
	draggable = false,
	isDragging,
	sticky,
	rowRef,
	children,
	sx,
	...props
}: CoreTableCellProps) => {
	const cellRef = useRef<HTMLTableCellElement>(null);
	const [width, setWidth] = useState<number | undefined>(undefined);
	const [stickyOffset, setStickyOffset] = useState<number>(0);
	const [isLeftRange, setIsLeftRange] = useState(false);

	// specify the width for td when dragging
	// otherwise td style will bug when dragging
	useEffect(() => {
		if (!draggable) return;
		if (!cellRef.current) return;
		const cell = cellRef.current;

		const resizeObserver = new ResizeObserver(() => {
			const { clientWidth } = cell;
			setWidth(clientWidth);
		});

		resizeObserver.observe(cell);

		return () => {
			resizeObserver.unobserve(cell);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// sticky
	useEffect(() => {
		if (!sticky) return;
		if (!rowRef?.current || !cellRef.current) return;
		const row = rowRef.current;
		const cellIndex = cellRef.current.cellIndex;

		const resizeObserver = new ResizeObserver(() => {
			const cells = Array.from(row.cells);

			// split the td of row
			if (cellIndex <= (row.cells.length - 1) / 2) {
				setIsLeftRange(true);
				const sliceAry = cells.slice(0, cellIndex);
				const hasStickyAry = sliceAry.filter((item) => getComputedStyle(item).position === 'sticky');

				setStickyOffset(hasStickyAry.length > 0 ? hasStickyAry.reduce((acc, cur) => acc + cur.clientWidth, 0) : 0);
			} else {
				setIsLeftRange(false);
				const sliceAry = cells.slice(cellIndex);
				const hasStickyAry = sliceAry.filter((item) => getComputedStyle(item).position === 'sticky');

				setStickyOffset(
					hasStickyAry.length > 1 ? hasStickyAry.slice(1).reduce((acc, cur) => acc + cur.clientWidth, 0) : 0,
				);
			}
		});

		resizeObserver.observe(row);

		return () => {
			resizeObserver.unobserve(row);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<StyledTableCell
			ref={cellRef}
			{...props}
			draggable={draggable}
			sticky={sticky}
			stickyOffset={stickyOffset}
			isLeftRange={isLeftRange}
			isDragging={isDragging}
			width={width}
			isChildrenTypeObject={typeof children === 'object'}
			sx={sx}
			hasClick={!!props.onClick}
			{...(sticky && {
				className: isLeftRange ? 'sticky-left' : 'sticky-right',
			})}
		>
			{children}
		</StyledTableCell>
	);
};

export default CoreTableCell;
