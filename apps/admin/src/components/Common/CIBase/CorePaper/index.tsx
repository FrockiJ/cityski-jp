import { PaperProps as MuiPaperProps } from '@mui/material';

import { StyledPaper } from './styles';

interface CorePaperProps extends MuiPaperProps {
	card?: boolean;
	dropdown?: boolean;
	modal?: boolean;
}

const CorePaper = ({ ...props }: CorePaperProps) => {
	return <StyledPaper {...props} />;
};

export default CorePaper;
