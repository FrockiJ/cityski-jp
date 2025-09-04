import { useEffect, useState } from 'react';
import { alpha, Avatar, Box, Divider, IconButton, MenuItem, Typography } from '@mui/material';
import { DialogAction } from '@repo/shared';

import CoreMenu from '@/CIBase/CoreMenu';
import ChoseDepartmentModal from '@/components/Project/shared/ChoseDepartmentModal';
import UpdatePasswordModal from '@/components/Project/shared/UpdatePasswordModal';
import useLogout from '@/hooks/useLogout';
import useModalProvider from '@/hooks/useModalProvider';
import { useAppSelector } from '@/state/store';
import { showToast } from '@/utils/ui/general';

import { HeaderWrapper } from './styles';

const Header = () => {
	const userInfo = useAppSelector((state) => state.user.userInfo);
	const accessToken = useAppSelector((state) => state.auth.accessToken);
	const departments = useAppSelector((state) => state.user.departments);
	const modal = useModalProvider();
	const { logout } = useLogout();
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);

	// --- FUNCTIONS ---

	const handleClick = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleChangePassword = () => {
		modal.openModal({
			title: `修改密碼`,
			width: 480,
			noEscAndBackdrop: true,
			children: <UpdatePasswordModal updateType='update' />,
			onClose: (action) => {
				if (action === DialogAction.CONFIRM) {
					showToast(`密碼已重設`, 'success');
				}
			},
		});
	};

	// --- EFFECTS ---
	useEffect(() => {
		if (userInfo?.isDefPassword == 'Y') {
			modal.openModal({
				title: `修改登入密碼`,
				width: 480,
				noEscAndBackdrop: true,
				children: <UpdatePasswordModal updateType='default' />,
				noCancel: true,
				noTitleCloseButton: true,
				onClose: (action) => {
					if (action === DialogAction.CONFIRM) {
						showToast(`密碼已重設`, 'success');
					}
				},
			});
		}
	}, []);

	const handleChangDepartment = () => {
		modal.openModal({
			title: `選擇分店`,
			width: 480,
			noEscAndBackdrop: true,
			noAction: true,
			marginBottom: true,
			children: <ChoseDepartmentModal departments={departments} accessToken={accessToken} />,
		});
	};

	return (
		<HeaderWrapper>
			<Typography variant='subtitle1' color='text.secondary'>
				{userInfo?.userRolesDepartments?.department.name}
			</Typography>
			<Box display='flex' alignItems='center' justifyContent='center'>
				<Box display='flex' alignItems='center' justifyContent='center'>
					<IconButton
						onClick={handleClick}
						size='small'
						aria-controls={open ? 'account-menu' : undefined}
						aria-haspopup='true'
						aria-expanded={open ? 'true' : undefined}
					>
						<Avatar
							sx={(theme) => ({
								fontSize: 14,
								fontWeight: 600,
								color: theme.palette.text.secondary,
								backgroundColor: alpha(theme.palette.text.quaternary, 0.24),
							})}
						>
							{userInfo?.name?.substring(0, 1).toUpperCase()}
						</Avatar>
					</IconButton>
					<CoreMenu
						open={open}
						anchorEl={anchorEl}
						onClose={handleClose}
						closeAfterTransition={false}
						anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
						transformOrigin={{ vertical: 'top', horizontal: 'right' }}
						slotProps={{
							paper: {
								sx: {
									minWidth: 220,
								},
							},
						}}
					>
						<MenuItem>
							<Box>
								<Typography variant='subtitle1'>{userInfo?.name}</Typography>
								<Typography variant='body2'>{userInfo?.email}</Typography>
							</Box>
						</MenuItem>
						<Divider sx={{ borderStyle: 'dashed' }} />
						{departments.length > 1 && (
							<MenuItem
								onClick={() => {
									handleClose();
									handleChangDepartment();
								}}
							>
								切換分店
							</MenuItem>
						)}
						<MenuItem
							onClick={() => {
								handleClose();
								handleChangePassword();
							}}
						>
							修改密碼
						</MenuItem>
						<Divider sx={{ borderStyle: 'dashed' }} />
						<MenuItem onClick={logout}>登出</MenuItem>
					</CoreMenu>
				</Box>
			</Box>
		</HeaderWrapper>
	);
};

export default Header;
