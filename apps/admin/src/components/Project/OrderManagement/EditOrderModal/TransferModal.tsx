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
import ConfirmTransferModal from './ConfirmTransferModal';
import { showToast } from '@/utils/ui/general';

interface TransferModalProps {
	open: boolean;
	onClose: () => void;
	onConfirm?: (fromOrderMemberId: string, toMemberId: string) => void;
	onSuccess?: () => void;
	members?: Array<{ id: string; name: string; memberId?: string }>;
}

const TransferModal: React.FC<TransferModalProps> = ({ open, onClose, onConfirm, onSuccess, members: orderMembers = [] }) => {
	const [selectedFromMember, setSelectedFromMember] = useState<string>('');
	const [selectedToMemberData, setSelectedToMemberData] = useState<MemberResponseDto | undefined>(undefined);
	const [receiverName, setReceiverName] = useState<string>('');
	const modal = useModalProvider();

	const handleMemberFromChange = (event: SelectChangeEvent<string>) => {
		setSelectedFromMember(event.target.value);
	};

	const handleConfirm = () => {
		if (!selectedFromMember || !selectedToMemberData) {
			return;
		}

		// Get the memberId from the selected OrderMember
		const fromOrderMember = orderMembers.find((om) => om.id === selectedFromMember);
		if (!fromOrderMember) {
			return;
		}

		// Check if trying to transfer to the same member
		if (fromOrderMember.memberId === selectedToMemberData.id) {
			showToast('不可以選擇相同的會員', 'error');
			return;
		}

		// Open confirmation modal
		modal.openModal({
			title: '確認轉讓',
			width: 480,
			noEscAndBackdrop: true,
			noAction: true,
			noTitleBorder: true,
			children: (
				<ConfirmTransferModal
					fromOrderMemberId={selectedFromMember}
					toMemberId={selectedToMemberData.id}
					handleRefresh={() => {
						// Close the transfer modal
						handleClose();
						// Call the optional callbacks
						onConfirm?.(selectedFromMember, selectedToMemberData.id);
						onSuccess?.();
					}}
				/>
			),
		});
	};

	const handleClose = () => {
		setSelectedFromMember('');
		setSelectedToMemberData(undefined);
		setReceiverName('');
		onClose();
	};

	const handleAddInvite = () => {
		// Get all member IDs from orderMembers to exclude them from search
		const excludeMemberIds = orderMembers
			.filter((om) => om.memberId)
			.map((om) => om.memberId as string);

		modal.openModal({
			title: '搜尋會員',
			width: 800,
			noEscAndBackdrop: true,
			noAction: true,
			noTitleBorder: true,
			children: (
				<AddMemberModal
					searchType='members'
					excludeMemberIds={excludeMemberIds}
					onSelectMember={(member: MemberResponseDto | OrderMemberSearchResponseDto) => {
						console.log('selected member in transfer modal:', member);
						// When searchType is 'members', we receive MemberResponseDto
						const memberData = 'member' in member ? member.member : member;
						setSelectedToMemberData(memberData as MemberResponseDto);
						setReceiverName(memberData.name);
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
							value={selectedFromMember}
							label='選擇轉讓成員'
							onChange={handleMemberFromChange}
						>
							{orderMembers.length === 0 ? (
								<MenuItem value='' disabled>
									無可選擇成員
								</MenuItem>
							) : (
								orderMembers.map((orderMember) => (
									<MenuItem key={orderMember.id} value={orderMember.id}>
										{orderMember.name}
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
					disabled={!selectedFromMember || !selectedToMemberData}
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
