import { Box } from '@mui/material';
import { DialogAction, MessageType } from '@repo/shared';
import dayjs from 'dayjs';

import CoreButton from '@/CIBase/CoreButton';
import CoreTableCell from '@/CIBase/CoreTable/CoreTableBody/CoreTableCell';
import CoreTableRow from '@/CIBase/CoreTable/CoreTableBody/CoreTableRow';
import withDynamicPermissions from '@/HOC/withDynamicPermissions';
import useModalProvider from '@/hooks/useModalProvider';
import { ModalMode } from '@/shared/types/general';
import { showToast } from '@/utils/ui/general';

import RoleDetailsModal from './RoleDetailsModal';
import RoleListOperate from './RoleListOperate';
import RoleSwitch from './RoleSwitch';

const CoreButtonButtonWithPermissions = withDynamicPermissions(CoreButton);
interface RoleListProps {
	rows: any[];
	mutate: any;
	draggable?: boolean;
}

const RoleList = ({ rows, mutate, draggable }: RoleListProps) => {
	const modal = useModalProvider();

	const handleOpenModal = (row?: any, mode: ModalMode = 'view') => {
		modal.openModal({
			title: mode === 'edit' ? '編輯角色' : '檢視角色',
			size: 'medium',
			children: <RoleDetailsModal roleId={row?.id} mode={mode} mutate={mutate} />,
		});
	};

	const handleDeleteModal = (id: number) => {
		modal.openMessageModal({
			type: MessageType.CONFIRM,
			title: '刪除角色',
			content: '一但刪除，將會從後台移除',
			confirmLabel: '刪除',
			onClose(action) {
				if (action === DialogAction.CONFIRM) {
					showToast(`已刪除 ${id}`, 'success');
				}
				close?.();
			},
		});
	};

	return (
		<>
			{rows.map((row, index) => (
				<CoreTableRow
					key={index}
					{...(draggable && {
						draggable,
						draggableId: row._id,
						draggableIndex: index,
					})}
				>
					<CoreTableCell>
						<RoleSwitch row={row} mutate={mutate} />
					</CoreTableCell>
					<CoreTableCell>{row.name}</CoreTableCell>
					<CoreTableCell>{row.name}</CoreTableCell>
					<CoreTableCell>{dayjs(row.updated_time).format('YYYY/MM/DD')}</CoreTableCell>
					<CoreTableCell>
						<Box sx={{ display: 'flex', marginLeft: '20px' }}>
							<Box sx={{ width: '100px' }}>
								<CoreButtonButtonWithPermissions
									label='編輯'
									size='large'
									handleOpenModal={() => handleOpenModal(row, 'edit')}
								/>
							</Box>
							<Box sx={{ width: '100px' }}>
								<CoreButtonButtonWithPermissions
									label='刪除'
									size='large'
									color='error'
									handleOpenModal={() => handleDeleteModal(row.id)}
								/>
							</Box>
						</Box>
					</CoreTableCell>
					<CoreTableCell>
						<RoleListOperate
							row={row}
							onOpenModal={handleOpenModal}
							handleDeleteModal={handleDeleteModal}
							mutate={mutate}
						/>
					</CoreTableCell>
				</CoreTableRow>
			))}
		</>
	);
};

export default RoleList;
