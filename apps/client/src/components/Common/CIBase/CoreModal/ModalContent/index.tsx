'use client';
import React from 'react';
import { DialogContentProps as MuiModalContentProps } from '@mui/material/DialogContent';

import CoreScrollbar from '../../CoreScrollbar';

interface ModalContentProps extends MuiModalContentProps {
	padding?: string;
}

const ModalContent: React.FC<ModalContentProps> = ({ children, padding }) => {
	return (
		<CoreScrollbar autoHide={false} style={{ flex: '1', padding: padding || '24px' }}>
			{children}
		</CoreScrollbar>
	);
};

export default ModalContent;
