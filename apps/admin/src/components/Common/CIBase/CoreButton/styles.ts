import { Button, styled } from '@mui/material';

import { CoreButtonProps } from '@/CIBase/CoreButton';

export const StyledButton = styled(Button, {
	shouldForwardProp: (prop) => prop !== 'iconType',
})<CoreButtonProps>(({ margin, width }) => ({
	margin,
	fontWeight: 700,
	width,
	whiteSpace: 'nowrap',
}));
