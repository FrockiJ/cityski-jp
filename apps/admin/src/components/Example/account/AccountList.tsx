import { Box } from '@mui/material';
import dayjs from 'dayjs';

import CoreButton from '@/CIBase/CoreButton';
import CoreTableCell from '@/CIBase/CoreTable/CoreTableBody/CoreTableCell';
import CoreTableRow from '@/CIBase/CoreTable/CoreTableBody/CoreTableRow';
import withDynamicPermissions from '@/HOC/withDynamicPermissions';
import useModalProvider from '@/hooks/useModalProvider';
import { AccountRowData } from '@/shared/types/accountModel';
import { ModalMode } from '@/shared/types/general';

import AccountDetailsModal from './AccountDetailsModal';
import AccountListOperate from './AccountListOperate';
import AccountSwitch from './AccountSwitch';

const CoreButtonButtonWithPermissions = withDynamicPermissions(CoreButton);

// const transRoleBg = (roleName: string) => {
// 	switch (roleName) {
// 		case '超級管理員':
// 			return 'warning';
// 		case '管理員':
// 			return 'secondary';
// 		default:
// 			return 'grey';
// 	}
// };

interface RoleListProps {
	rows: any[];
	mutate: any;
}

const RoleList = ({ rows, mutate }: RoleListProps) => {
	const modal = useModalProvider();

	const handleOpenModal = (row?: AccountRowData, mode: ModalMode = 'view') => {
		modal.openModal({
			title: mode === 'edit' ? '編輯帳號' : '檢視帳號',
			children: <AccountDetailsModal accountId={row?.id} mutate={mutate} mode={mode} />,
		});
	};

	return (
		<>
			{rows.map((row, index) => (
				<CoreTableRow key={index}>
					<CoreTableCell>
						<AccountSwitch row={row} mutate={mutate} />
					</CoreTableCell>
					<CoreTableCell>{row.coach}</CoreTableCell>
					<CoreTableCell>{row.coach}</CoreTableCell>
					<CoreTableCell>{row.coach}</CoreTableCell>
					<CoreTableCell>{dayjs(row.created).format('YYYY/MM/DD')}</CoreTableCell>
					<CoreTableCell>
						<Box sx={{ display: 'flex', marginLeft: '30px' }}>
							<Box sx={{ width: '100px' }}>
								<Box sx={{ width: '100px' }}>
									<CoreButtonButtonWithPermissions
										iconType='edit'
										label='Edit'
										handleOpenModal={() => handleOpenModal(row, 'edit')}
									/>
								</Box>
							</Box>
						</Box>
					</CoreTableCell>
					<CoreTableCell>
						<AccountListOperate row={row} onOpenModal={handleOpenModal} />
					</CoreTableCell>
				</CoreTableRow>
			))}
		</>
	);
};

export default RoleList;
