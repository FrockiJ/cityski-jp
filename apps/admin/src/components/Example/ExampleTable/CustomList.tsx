import { useEffect } from 'react';
import { Box } from '@mui/material';

import CoreEllipsisTextWithTooltip from '@/CIBase/CoreEllipsisTextWithTooltip';
import CoreLabel from '@/CIBase/CoreLabel';
import CoreTableCell from '@/CIBase/CoreTable/CoreTableBody/CoreTableCell';
import CoreTableRow from '@/CIBase/CoreTable/CoreTableBody/CoreTableRow';
import { TableDataResult } from '@/shared/types/apiModels';

interface CustomListProps {
	rows: any[];
	selectable?: boolean; // optional
	handleGetIds?: (ids: string[]) => void;
	handleCheckedItem?: (rowId: string) => (checked: boolean) => void;
	checkedList?: string[];
	draggable?: boolean; // optional
}

const CustomList = ({ rows, selectable, draggable, handleGetIds, handleCheckedItem, checkedList }: CustomListProps) => {
	// selectable checkbox
	useEffect(() => {
		handleGetIds?.(rows.map(({ _id }) => _id));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [rows]);

	return (
		<>
			{rows.map((row: TableDataResult, index) => (
				<CoreTableRow
					key={row._id}
					{...(selectable && {
						selectable,
						handleChecked: handleCheckedItem?.(row._id),
						controlChecked: checkedList?.includes(row._id),
					})}
					{...(draggable && {
						draggable,
						draggableId: row._id,
						draggableIndex: index,
					})}
				>
					<CoreTableCell sticky>
						<div
							style={{
								width: 'fit-content',
								display: 'grid',
								gridAutoFlow: 'column',
								placeItems: 'center',
							}}
						>
							<img
								src={`/icons/${row.conference === 'West' ? 'critical' : 'status-success'}-icon.svg`}
								alt=''
								width={25}
								height={16}
							/>
							{row.conference}
						</div>
					</CoreTableCell>
					<CoreTableCell>{row.division}</CoreTableCell>
					<CoreTableCell sticky>{row.created}</CoreTableCell>
					<CoreTableCell>{row.team}</CoreTableCell>
					<CoreTableCell>
						<CoreEllipsisTextWithTooltip>{row.news}</CoreEllipsisTextWithTooltip>
					</CoreTableCell>
					<CoreTableCell>
						<Box display='flex' justifyContent='flex-start' alignItems='center' gap='5px'>
							{row.players.length > 3 ? (
								<>
									<CoreLabel color='primary'>{row.players[0]}</CoreLabel>
									<CoreLabel color='secondary'>{`+${row.players.length - 1}`}</CoreLabel>
								</>
							) : (
								row.players.map((item: string, index) => (
									<CoreLabel color='primary' key={index}>
										{item}
									</CoreLabel>
								))
							)}
						</Box>
					</CoreTableCell>
					<CoreTableCell sticky>{row.coach}</CoreTableCell>
				</CoreTableRow>
			))}
		</>
	);
};

export default CustomList;
