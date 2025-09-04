import { toast, ToastPosition } from 'react-toastify';

import ToastErrorIcon from '@/components/Icon/ToastErrorIcon';
import ToastSuccessIcon from '@/components/Icon/ToastSuccessIcon';

/**
 *
 * @param message - message to show on toast window
 * @param type - info | success | warning | error
 * @param position - position of toast, example option: toast.POSITION.TOP_RIGHT,
 * @returns
 */
export const showToast = (
	message: string,
	type: 'default' | 'info' | 'success' | 'warning' | 'error' = 'default',
	position: ToastPosition = 'top-center',
) => {
	const toastConfig = {
		position,
		icon: type === 'success' ? <ToastSuccessIcon /> : <ToastErrorIcon />,
	};

	switch (type) {
		case 'success':
			toast.success(message, toastConfig);
			break;
		case 'error':
			toast.error(message, toastConfig);
			break;
		default:
			toast.info(message, { ...toastConfig, icon: false });
			break;
	}
};
