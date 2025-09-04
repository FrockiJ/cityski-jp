import { toast, ToastOptions, ToastPosition } from 'react-toastify';

import ErrorIcon from '@/Icon/ErrorIcon';
import InfoIcon from '@/Icon/InfoIcon';
import SuccessIcon from '@/Icon/SuccessIcon';
import WarningIcon from '@/Icon/WarningIcon';
import { ERROR_MAIN, SECONDARY_BASIC, SUCCESS_MAIN, WARNING_MAIN } from '@/shared/constants/colors';

/**
 *
 * @param message - message to show on toast window
 * @param type - info | success | warning | error
 * @param position - position of toast, example option: 'top-right' | 'top-center' | 'top-left' | 'bottom-right' | 'bottom-center' | 'bottom-left',
 * @param autoClose - set the delay in ms to close the toast automatically. Default: 5000
 * @returns
 */
export const showToast = (
	message: string,
	type: 'default' | 'info' | 'success' | 'warning' | 'error' = 'default',
	position: ToastPosition = 'top-center',
	autoClose?: ToastOptions['autoClose'],
) => {
	switch (type) {
		case 'success':
			toast.success(message, {
				position,
				icon: <SuccessIcon sx={{ color: SUCCESS_MAIN }} />,
				autoClose,
			});
			break;
		case 'error':
			toast.error(message, {
				position,
				icon: <ErrorIcon sx={{ color: ERROR_MAIN }} />,
				autoClose,
			});
			break;
		case 'info':
			toast.info(message, {
				position,
				icon: <InfoIcon sx={{ color: SECONDARY_BASIC }} />,
				autoClose,
			});
			break;
		case 'warning':
			toast.warning(message, {
				position,
				icon: <WarningIcon sx={{ color: WARNING_MAIN }} />,
				autoClose,
			});
			break;
		default:
			toast.info(message, {
				position,
				icon: false,
				autoClose,
			});
			break;
	}
};
