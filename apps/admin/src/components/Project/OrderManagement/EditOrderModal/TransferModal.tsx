import React, { useState } from 'react';
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
	Button,
	IconButton,
	Divider,
	Box,
	MenuItem,
	Select,
	FormControl,
	InputLabel,
	Stack,
	SelectChangeEvent,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import { MemberResponseDto, OrderMemberSearchResponseDto } from '@repo/shared';

import AddMemberModal from '@/components/Project/ReservationManagement/AddMemberModal';
import useModalProvider from '@/hooks/useModalProvider';

interface TransferModalProps {
	open: boolean;
	onClose: () => void;
	onConfirm: (selectedMember: string, selectedMemberData?: OrderMemberSearchResponseDto) => void;
	members?: Array<{ id: string; name: string }>;
}

const TransferModal: React.FC<TransferModalProps> = ({ open, onClose, onConfirm, members = [] }) => {
	const [selectedMember, setSelectedMember] = useState<string>('');
	const [selectedMemberData, setSelectedMemberData] = useState<OrderMemberSearchResponseDto | undefined>(undefined);
	const [receiverName, setReceiverName] = useState<string>('');
	const modal = useModalProvider();

	const handleMemberChange = (event: SelectChangeEvent<string>) => {
		setSelectedMember(event.target.value);
		// Clear the selected member data from AddMemberModal if user selects from dropdown
		setSelectedMemberData(undefined);
		setReceiverName('');
	};

	const handleConfirm = () => {
		onConfirm(selectedMember, selectedMemberData);
		handleClose();
	};

	const handleClose = () => {
		setSelectedMember('');
		setSelectedMemberData(undefined);
		setReceiverName('');
		onClose();
	};

	const handleAddInvite = () => {
		modal.openModal({
			title: '搜尋會員',
			width: 800,
			noEscAndBackdrop: true,
			noAction: true,
			noTitleBorder: true,
			children: (
				<AddMemberModal
					searchType='members'
					onSelectMember={(member: MemberResponseDto) => {
						console.log('selected member in transfer modal:', member.name);
						setSelectedMemberData(member);
						setReceiverName(member.name);
						// Clear the dropdown selection
						// setSelectedMember('');
					}}
				/>
			),
		});
	};

	return (
		<Dialog
			open={open}
			onClose={handleClose}
			maxWidth='xs'
			fullWidth
			PaperProps={{
				sx: {
					borderRadius: 2,
					boxShadow: '0px 40px 80px -8px rgba(145, 158, 171, 0.24)',
				},
			}}
		>
			<DialogTitle
				sx={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					pl: 3,
					pr: 1,
					py: 2,
					fontWeight: 700,
					fontSize: '18px',
				}}
			>
				轉讓訂單
				<IconButton
					onClick={handleClose}
					size='medium'
					sx={{
						color: 'action.active',
					}}
				>
					<CloseIcon />
				</IconButton>
			</DialogTitle>

			<Divider />

			<DialogContent sx={{ px: 3, py: 4 }}>
				<Stack spacing={3} position='relative'>
					<FormControl fullWidth>
						<InputLabel id='transfer-member-label'>選擇轉讓成員</InputLabel>
						<Select
							labelId='transfer-member-label'
							id='transfer-member-select'
							value={selectedMember}
							label='選擇轉讓成員'
							onChange={handleMemberChange}
						>
							{members.length === 0 ? (
								<MenuItem value='' disabled>
									無可選擇成員
								</MenuItem>
							) : (
								members.map((member) => (
									<MenuItem key={member.id} value={member.id}>
										{member.name}
									</MenuItem>
								))
							)}
						</Select>
					</FormControl>

					<Box
						sx={{
							display: 'flex',
							alignItems: 'center',
							gap: 1.5,
							p: 1.75,
							border: '1px solid',
							borderColor: 'divider',
							borderRadius: 1,
							bgcolor: 'background.paper',
						}}
					>
						<TextField
							fullWidth
							size='small'
							placeholder='接收成員'
							value={receiverName}
							variant='standard'
							InputProps={{
								disableUnderline: true,
								readOnly: true,
							}}
							sx={{
								'& .MuiInputBase-input': {
									fontSize: '16px',
								},
							}}
						/>
						<Button
							variant='outlined'
							size='small'
							onClick={handleAddInvite}
							sx={{
								minWidth: 'auto',
								px: 1.25,
								py: 0.5,
								fontSize: '12px',
								fontWeight: 700,
								textTransform: 'none',
								whiteSpace: 'nowrap',
							}}
						>
							選擇
						</Button>
					</Box>

					{/* Transfer icon in the center */}
					<Box
						sx={{
							position: 'absolute',
							top: '50%',
							left: '50%',
							transform: 'translate(-50%, -50%)',
							bgcolor: 'background.paper',
							border: '1px solid',
							borderColor: 'divider',
							borderRadius: '50%',
							width: 48,
							height: 48,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							zIndex: 1,
						}}
					>
						<SwapVertIcon sx={{ color: 'text.secondary' }} />
					</Box>
				</Stack>
			</DialogContent>

			<Divider />

			<DialogActions sx={{ p: 3, gap: 1.5 }}>
				<Button
					variant='outlined'
					onClick={handleClose}
					sx={{
						px: 2,
						py: 0.75,
						fontSize: '14px',
						fontWeight: 700,
						textTransform: 'none',
						color: 'text.primary',
						borderColor: 'divider',
					}}
				>
					取消
				</Button>
				<Button
					variant='contained'
					onClick={handleConfirm}
					disabled={!selectedMember && !selectedMemberData}
					sx={{
						px: 2,
						py: 0.75,
						fontSize: '14px',
						fontWeight: 700,
						textTransform: 'none',
					}}
				>
					確定
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default TransferModal;
