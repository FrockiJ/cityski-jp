import { Dialog, Typography } from '@mui/material';
import { DialogAction, MessageType } from '@repo/shared';
import HTMLReactParser from 'html-react-parser';

import CoreButton from '@/CIBase/CoreButton';
import { MessageModalProps } from '@/shared/core/Types/modal';
import { closeMessageModal, removeMessageModal } from '@/state/slices/layoutSlice';
import { useAppDispatch } from '@/state/store';

import ModalActions from '../CoreModalActions';
import ModalContent from '../ModalContent';
import ModalTitle from '../ModalTitle';

const typeTransfer = (value: MessageType) => {
	switch (value) {
		case MessageType.ERROR:
			return 'error';
		case MessageType.WARNING:
			return 'warning';
		case MessageType.INFO:
		case MessageType.CONFIRM:
			return 'primary';
	}
};

/**
 * message modal component. Using from every message, info, confirm, delete, alert, etc.
 */
const MessageModalWrapper = ({
	id,
	open,
	type,
	title,
	content,
	width,
	cancelLabel,
	confirmLabel,
	onClose,
}: MessageModalProps) => {
	const dispatch = useAppDispatch();

	// set modal open=false, component still exit on dom for animation
	const handleNoneModal = (id: string) => {
		dispatch(closeMessageModal(id));
	};
	// remove redux modal data, then disappear on dom
	const handleRemoveModal = (id: string) => {
		dispatch(removeMessageModal(id));
	};
	// entry point
	const handleCloseModal = (action?: DialogAction) => {
		handleNoneModal(id);
		if (action && onClose) {
			onClose(action);
		}
	};
	// after transition finished, remove modal
	const handleModalTransitionEnd = () => {
		handleRemoveModal(id);
	};

	return (
		<Dialog
			open={open}
			onClose={(event, reason) => {
				if (reason === 'escapeKeyDown') return;
				if (reason === 'backdropClick') return;
				handleCloseModal();
			}}
			closeAfterTransition={false}
			// TransitionComponent={center ? TransitionZoom : TransitionSlider}
			TransitionProps={{
				onExited: handleModalTransitionEnd,
			}}
			PaperProps={{
				sx: {
					margin: 0,
					borderRadius: 2,
					overflowY: 'hidden',
					width: width || '480px',
					maxWidth: width || '480px',
				},
				style: {
					minWidth: width,
				},
			}}
			// keepMounted
			// onBackdropClick={(e: React.SyntheticEvent) => handleClose(e, 'backdropClick')}
		>
			<>
				<ModalTitle title={title} noTitleBorder />
				<ModalContent padding='0 24px'>
					<Typography variant='body1' color='text.secondary'>
						{content && HTMLReactParser(content)}
					</Typography>
				</ModalContent>
				<ModalActions noTopBorder>
					{type !== MessageType.WARNING && type !== MessageType.INFO && (
						<CoreButton
							color='default'
							variant='outlined'
							label={cancelLabel || '取消'}
							onClick={() => {
								handleCloseModal(DialogAction.CANCEL);
							}}
						/>
					)}

					<CoreButton
						type='submit'
						color={typeTransfer(type as MessageType)}
						variant='contained'
						label={confirmLabel || '確認'}
						onClick={() => {
							handleCloseModal(DialogAction.CONFIRM);
						}}
					/>
				</ModalActions>
			</>
		</Dialog>
	);
};

export default MessageModalWrapper;
