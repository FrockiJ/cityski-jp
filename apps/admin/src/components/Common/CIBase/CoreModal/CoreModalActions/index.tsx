import { ReactNode } from 'react';

import { StyledAbsoluteModalActions, StyledMuiModalActions } from '../styles';

export { StyledAbsoluteModalActions };

interface CoreModalActionsProps {
	children: ReactNode;
	noTopBorder?: boolean;
}

const CoreModalActions = ({ children, noTopBorder }: CoreModalActionsProps) => {
	return <StyledMuiModalActions noTopBorder={noTopBorder}>{children}</StyledMuiModalActions>;
};

export default CoreModalActions;
