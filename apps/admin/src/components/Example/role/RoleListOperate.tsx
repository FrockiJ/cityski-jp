import { useState } from 'react';
import { MenuItem } from '@mui/material';
import IconButton from '@mui/material/IconButton';

import CoreMenu from '@/CIBase/CoreMenu';
import EditIcon from '@/Icon/EditIcon';
import EyeIcon from '@/Icon/EyeIcon';
import MoreIcon from '@/Icon/MoreIcon';
import TrashIcon from '@/Icon/TrashIcon';
import { ModalMode } from '@/shared/types/general';
import { useAppSelector } from '@/state/store';

const RoleListOperate = ({
	row,
	onOpenModal,
	// mutate,
	handleDeleteModal,
}: {
	row: any;
	onOpenModal: (row: any, mode?: ModalMode) => void;
	mutate: any;
	handleDeleteModal: (id: number) => void;
}) => {
	const permissions = useAppSelector((state) => state.auth.permissions);

	// const modal = useModalProvider();
	const handleOpenPopModal = (mode: ModalMode) => {
		handleCloseMenu();
		onOpenModal(row, mode);
	};

	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const handleCloseMenu = () => {
		setAnchorEl(null);
	};

	const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleOpenDeleteModal = () => {
		handleCloseMenu();
		handleDeleteModal(row.id);
		//   modal.openModal({
		//     title: '',
		//     width: 480,
		//     height: 180,
		//     center: true,
		//     children:
		//       row.super_adm === '1' ? (
		//         <RoleDeleteDisabledModal />
		//       ) : (
		//         <RoleDeleteModal id={row.id} mutate={mutate} />
		//       ),
		// );
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
				<MenuItem disabled={!permissions?.edit} sx={{ color: 'error.main' }} onClick={handleOpenDeleteModal}>
					<TrashIcon />
					刪除
				</MenuItem>

				<MenuItem disabled={!permissions?.edit} onClick={() => handleOpenPopModal('edit')}>
					<EditIcon />
					編輯
				</MenuItem>

				<MenuItem disabled={!permissions?.view} onClick={() => handleOpenPopModal('view')}>
					<EyeIcon /> 檢視
				</MenuItem>
			</CoreMenu>
		</>
	);
};

export default RoleListOperate;
