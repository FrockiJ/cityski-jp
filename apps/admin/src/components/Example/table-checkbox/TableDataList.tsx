import { useEffect } from 'react';
import dayjs from 'dayjs';

import CoreTableCell from '@/CIBase/CoreTable/CoreTableBody/CoreTableCell';
import CoreTableRow from '@/CIBase/CoreTable/CoreTableBody/CoreTableRow';
import { AccountRowData } from '@/shared/types/accountModel';
import { ModalMode } from '@/shared/types/general';
import { setModal } from '@/state/slices/layoutSlice';
import { useAppDispatch } from '@/state/store';

import AccountDetailsModal from '../account/AccountDetailsModal';
import AccountListOperate from '../account/AccountListOperate';
import AccountSwitch from '../account/AccountSwitch';

interface TableCheckboxListProps {
	rows: any[];
	mutate: any;
	selectable?: boolean;
	handleGetIds?: (ids: string[]) => void;
	handleCheckedItem?: (rowId: string) => (checked: boolean) => void;
	checkedList?: string[];
}

const TableCheckboxList = ({
	rows,
	mutate,
	selectable,
	handleGetIds,
	handleCheckedItem,
	checkedList,
}: TableCheckboxListProps) => {
	const dispatch = useAppDispatch();

	const onOpenModal = (row?: AccountRowData, mode: ModalMode = 'view') => {
		dispatch(
			setModal({
				title: mode === 'edit' ? '編輯帳號' : '檢視帳號',
				children: <AccountDetailsModal accountId={row?.id} mutate={mutate} mode={mode} />,
			}),
		);
	};

	// selectable checkbox
	useEffect(() => {
		handleGetIds?.(rows.map(({ _id }) => _id));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [rows]);

	return (
		<>
			{rows.map((row, index) => (
				<CoreTableRow
					key={index}
					{...(selectable && {
						selectable,
						handleChecked: handleCheckedItem?.(row._id),
						controlChecked: checkedList?.includes(row._id),
					})}
				>
					<CoreTableCell sticky>
						{/* <Label>未開通</Label> */}
						<AccountSwitch row={row} mutate={mutate} />
					</CoreTableCell>
					<CoreTableCell>{row.coach}</CoreTableCell>
					<CoreTableCell>{row.coach}</CoreTableCell>
					<CoreTableCell>{row.coach}</CoreTableCell>
					<CoreTableCell>{dayjs(row.created).format('YYYY/MM/DD')}</CoreTableCell>
					<CoreTableCell sx={{ color: 'blue', cursor: 'pointer' }} onClick={() => onOpenModal(row, 'edit')}>
						編輯
					</CoreTableCell>
					<CoreTableCell sticky>
						<AccountListOperate row={row} onOpenModal={onOpenModal} />
					</CoreTableCell>
				</CoreTableRow>
			))}
		</>
	);
};

export default TableCheckboxList;
