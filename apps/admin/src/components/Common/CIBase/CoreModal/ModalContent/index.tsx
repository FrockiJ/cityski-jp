import { DialogContentProps as MuiModalContentProps } from '@mui/material';

import CoreScrollbar from '../../CoreScrollbar';

interface ModalContentProps extends MuiModalContentProps {
	padding?: string;
}

const ModalContent = ({ children, padding }: ModalContentProps) => {
	return (
		<CoreScrollbar autoHide={false} style={{ flex: '1', padding: padding || '24px' }}>
			{children}
		</CoreScrollbar>
	);
};

export default ModalContent;
