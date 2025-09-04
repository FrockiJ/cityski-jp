'use client';
import React, { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { FormikProps, FormikValues } from 'formik';

import { closeModal, removeModal } from '@/state/slices/layoutSlice';

import { DialogAction } from '../../../../../shared/core/constants/enum';
import { ModalProps } from '../../../../../shared/core/Types/modal';
// import CoreButton from '../../CoreButton';
import MuiModalActions from '../CoreModalActions';
import ModalTitle from '../ModalTitle';
import { StyledModal, StyledModalContent } from '../styles';
import TransitionSlider from '../TransitionSlider';
import TransitionZoom from '../TransitionZoom';

/**
 * Renders a customizable modal window with control and layout options.
 *
 * @component
 * @param {boolean} [props.fullscreen=false] - If `true`, expands the modal to full screen.
 * @param {boolean} [props.noHeader=false] - Hides the header area, including the title and close button.
 * @param {boolean} [props.noAction=false] - Removes the action area at the bottom of the modal. Use for modals that *                                           do not require user actions.
 *                                           Opt for a minimalist modal design.
 * @param {boolean} [props.noEscAndBackdrop=false] - Disables modal closure via Escape key or clicking on the     *                                                   backdrop. Enforces focused user interaction.
 * @param {string} [props.title] - Sets the modal's header title. Provides context and enhances accessibility.
 * @param {string} [props.confirmLabel='Confirm'] - Custom label for the confirmation button. Customize for *                                                action-specific naming.
 * @param {string} [props.cancelLabel='Cancel'] - Custom label for the cancellation button. Customize for *                                                action-specific naming.
 * @param {(action: ModalAction) => void} [props.onClose] - Callback function to execute after the modal *                                                                    closes with a cancel or confirm.
 * @example
 *
 * ```tsx
 * <BasicModalWrapper
 *   title="Confirm Action"
 *   confirmLabel="Confirm"
 *   cancelLabel="Cancel"
 *   onClose={handleClose}
 * >
 *   <ModalContent>Are you sure?</ModalContent>
 * </BasicModalWrapper>
 * ```
 */

const BasicModalWrapper: React.FC<ModalProps> = ({
	id,
	open,
	noHeader = false,
	noAction,
	noEscAndBackdrop = false,
	confirmLabel,
	cancelLabel,
	fullScreen = false,
	title,
	width,
	height,
	size,
	contentBGColor,
	center = true,
	children,
	onClose,
}) => {
	// constants
	const DEFAULT_MODAL_WIDTH = '420px';

	const formRef = useRef<FormikProps<FormikValues>>(null);
	const dispatch = useDispatch();

	const handleNoneModal = (id: string) => {
		dispatch(closeModal(id));
	};

	const handleRemoveModal = (id: string) => {
		dispatch(removeModal(id));
	};

	const handleCloseModal = (action: DialogAction) => {
		handleNoneModal(id);
		onClose?.(action);
	};

	const handleModalTransitionEnd = () => {
		handleRemoveModal(id);
	};

	const handleConfirm = () => {
		if (formRef.current) {
			formRef.current.handleSubmit();
		} else {
			handleNoneModal(id);
			onClose?.(DialogAction.CONFIRM);
		}
	};

	// adding exception for non-react element children prop
	if (typeof children?.type !== 'function') {
		throw new Error('Children prop must be a component.');
	}

	return (
		<StyledModal
			open={open}
			onClose={(_, reason) => {
				if (noEscAndBackdrop && (reason === 'escapeKeyDown' || reason === 'backdropClick')) return;
				handleCloseModal(DialogAction.CANCEL);
			}}
			TransitionComponent={center ? TransitionZoom : TransitionSlider}
			TransitionProps={{ onExited: handleModalTransitionEnd }}
			fullScreen={fullScreen}
			size={size}
			width={width || DEFAULT_MODAL_WIDTH}
			fullscreen={fullScreen}
		>
			{!noHeader && <ModalTitle title={title} handleClose={handleCloseModal} />}
			<StyledModalContent center={center} height={height} contentBGColor={contentBGColor} fullscreen={fullScreen}>
				{children &&
					React.cloneElement(children, {
						handleCloseModal,
						formRef,
					})}
			</StyledModalContent>
			{!noAction && (
				<MuiModalActions>
					<></>
					{/* <CoreButton
						variant='outlined'
						label={cancelLabel || 'Cancel'}
						onClick={() => handleCloseModal(DialogAction.CANCEL)}
					/>
					<CoreButton
						color='primary'
						variant='contained'
						type='submit'
						label={confirmLabel || 'Confirm'}
						onClick={handleConfirm}
					/> */}
				</MuiModalActions>
			)}
		</StyledModal>
	);
};

export default BasicModalWrapper;
