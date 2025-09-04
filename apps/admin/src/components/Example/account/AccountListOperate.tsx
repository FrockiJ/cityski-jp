import { useState } from 'react';
import { IconButton, MenuItem } from '@mui/material';

import CoreMenu from '@/CIBase/CoreMenu';
import EditIcon from '@/Icon/EditIcon';
import EyeIcon from '@/Icon/EyeIcon';
import MoreIcon from '@/Icon/MoreIcon';
import { AccountRowData } from '@/shared/types/accountModel';
import { ModalMode } from '@/shared/types/general';
import { useAppSelector } from '@/state/store';

const AccountListOperate = ({
	row,
	onOpenModal,
}: {
	row: AccountRowData;
	onOpenModal: (row: AccountRowData, mode?: ModalMode) => void;
}) => {
	const permissions = useAppSelector((state) => state.auth.permissions);

	const handleOpenModal = (mode: ModalMode) => {
		handleCloseMenu();
		onOpenModal(row, mode);
	};

	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};
	const handleCloseMenu = () => {
		setAnchorEl(null);
	};

	return (
		<>
			<IconButton onClick={handleOpenMenu}>
				<MoreIcon fontSize='small' />
			</IconButton>
			<CoreMenu
				open={Boolean(anchorEl)}
				anchorEl={anchorEl}
				onClose={handleCloseMenu}
				anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
				transformOrigin={{ vertical: 'top', horizontal: 'right' }}
			>
				<MenuItem disabled={!permissions?.edit} onClick={() => handleOpenModal('edit')}>
					<EditIcon /> 編輯
				</MenuItem>

				<MenuItem disabled={!permissions?.view} onClick={() => handleOpenModal('view')}>
					<EyeIcon /> 查看
				</MenuItem>
			</CoreMenu>
		</>
	);
};

export default AccountListOperate;
