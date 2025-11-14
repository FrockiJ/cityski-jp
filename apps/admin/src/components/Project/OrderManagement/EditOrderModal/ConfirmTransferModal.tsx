import React, { useState } from 'react';
import { Typography } from '@mui/material';
import { DialogAction } from '@repo/shared';

import CoreModalContent from '@/CIBase/CoreModal/ModalContent';
import CoreButton from '@/components/Common/CIBase/CoreButton';
import { StyledAbsoluteModalActions } from '@/components/Common/CIBase/CoreModal/styles';
import { transferOrderMember } from '@/utils/http/api';
import { showToast } from '@/utils/ui/general';

type Props = {
	fromOrderMemberId: string;
	toMemberId: string;
	handleCloseModal?: (action: DialogAction) => void;
	handleRefresh?: () => void;
};

const ConfirmTransferModal = (props: Props) => {
	const [isLoading, setIsLoading] = useState(false);

	const handleConfirm = async () => {
		try {
			setIsLoading(true);
			await transferOrderMember({
				fromId: props.fromOrderMemberId,
				toId: props.toMemberId,
			});

			showToast('轉讓成功', 'success');
			props.handleCloseModal?.(DialogAction.CONFIRM);
			props.handleRefresh?.();
		} catch (error) {
			console.error('Transfer failed:', error);
			showToast('轉讓失敗，請稍後再試', 'error');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<>
			<CoreModalContent padding='24px 0'>
				<Typography>
					一旦轉讓，無法替換接收會員。是否已確認所有接收人員名單。
				</Typography>
			</CoreModalContent>
			<StyledAbsoluteModalActions justifyContent='flex-end'>
				<CoreButton
					color='default'
					variant='outlined'
					label='取消'
					onClick={() => props.handleCloseModal?.(DialogAction.CANCEL)}
					margin='0 12px 0 0'
					disabled={isLoading}
				/>
				<CoreButton
					color='primary'
					variant='contained'
					label='確認'
					onClick={handleConfirm}
					disabled={isLoading}
				/>
			</StyledAbsoluteModalActions>
		</>
	);
};

export default ConfirmTransferModal;
