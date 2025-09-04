import { MessageModalCustomProps, ModalCustomProps } from '@/shared/core/Types/modal';
import { setMessageModal, setModal } from '@/state/slices/layoutSlice';
import { useAppDispatch } from '@/state/store';

/**
 * @hook
 * useModalProvider Hook
 * Provides functions to open various modal dialogs within the application with customizable options.
 * 
 * @returns {{
*   openModal: (option: DialogCustomProps) => void,
*   openMessageModal: (option: MessageDialogCustomProps) => void
* }} An object containing the following functions:
* 
* - `openModal`: Opens a generic modal dialog with customizable options:
*    - `option` {DialogCustomProps} - Configuration option object for the modal, properties include:
*       - `fullscreen` {boolean} [false] - If `true`, expands the dialog to occupy the full screen.
*       - `noHeader` {boolean} [false] - When set to `true`, hides the dialog's header area.
*       - `noAction` {boolean} [false] - If `true`, omits the action area at the bottom of the dialog.
*       - `noEscAndBackdrop` {boolean} [false] - Disables closing the dialog via escape key or clicking on the backdrop.
*       - `title` {string} - The title text displayed in the dialog's header.
*       - `confirmLabel` {string} ['Confirm'] - Custom text for the confirmation button.
*       - `cancelLabel` {string} ['Cancel'] - Custom text for the cancellation button.
*       - `onClose` {(action: DialogAction) => void} - Callback function executed after the dialog closes receiving the action taken (cancel or confirm) as a parameter.
* 
* - `openMessageModal`: Opens a message modal dialog with predefined options for simple message displays.
*    - `option` {MessageDialogCustomProps} - Configuration options for the message dialog, which extend
DialogCustomProps with additional properties specific to message dialogs.

*/

const useModalProvider = () => {
	const dispatch = useAppDispatch();
	const openModal = (option: ModalCustomProps) => {
		dispatch(setModal(option));
	};

	const openMessageModal = (option: MessageModalCustomProps) => {
		dispatch(setMessageModal(option));
	};
	return {
		openModal,
		openMessageModal,
	};
};

export default useModalProvider;
