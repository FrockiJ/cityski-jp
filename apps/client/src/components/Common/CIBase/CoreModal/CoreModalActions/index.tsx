'use client';
import { ReactNode } from 'react';

import { StyledMuiModalActions } from '../styles';

interface CoreModalActionsProps {
	children: ReactNode;
	noTopBorder?: boolean;
}

const CoreModalActions: React.FC<CoreModalActionsProps> = ({ children, noTopBorder }) => {
	return <StyledMuiModalActions noTopBorder={noTopBorder}>{children}</StyledMuiModalActions>;
};

export default CoreModalActions;
