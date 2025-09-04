'use client';
import { useDispatch } from 'react-redux';
import MuiDialog from '@mui/material/Dialog';
import HTMLReactParser from 'html-react-parser';

import { closeMessageModal, removeMessageModal } from '@/state/slices/layoutSlice';

import { DialogAction } from '../../../../../shared/core/constants/enum';
import { MessageModalProps, MessageType } from '../../../../../shared/core/Types/modal';
// import CoreButton from '../../CoreButton';
import ModalActions from '../CoreModalActions';
import ModalContent from '../ModalContent';
import ModalTitle from '../ModalTitle';

const typeTransfer = (value: MessageType) => {
	switch (value) {
		case 'error':
			return 'error';
		case 'warning':
			return 'warning';
		case 'info':
			return 'info';
		case 'confirm':
			return 'primary';
	}
};

/**
 * message modal component. Using from every message, info, confirm, delete, alert, etc.
 */
const MessageModalWrapper: React.FC<MessageModalProps> = ({
	id,
	open,
	type,
	title,
	content,
	width,
	cancelLabel,
	confirmLabel,
	onClose,
}) => {
	const dispatch = useDispatch();

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
		<MuiDialog
			open={open}
			onClose={(event, reason) => {
				if (reason === 'escapeKeyDown') return;
				if (reason === 'backdropClick') return;
				handleCloseModal();
			}}
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
				<ModalContent padding='0 24px'>{content && HTMLReactParser(content)}</ModalContent>
				<ModalActions noTopBorder>
					<></>
					{/* {type !== 'warning' && type !== 'info' && (
						<CoreButton
							variant='outlined'
							label={cancelLabel || 'cancel'}
							onClick={() => {
								handleCloseModal(DialogAction.CANCEL);
							}}
						/>
					)}

					<CoreButton
						type='submit'
						color={typeTransfer(type as MessageType)}
						variant='contained'
						label={confirmLabel || 'confirm'}
						onClick={() => {
							handleCloseModal(DialogAction.CONFIRM);
						}}
					/> */}
				</ModalActions>
			</>
		</MuiDialog>
	);
};

export default MessageModalWrapper;
