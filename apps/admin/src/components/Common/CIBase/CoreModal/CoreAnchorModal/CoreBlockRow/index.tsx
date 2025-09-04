import { BoxProps } from '@mui/material';

import { StyledRow } from '../styles';

interface CoreBlockRowProps extends BoxProps {
	children: React.ReactNode;
	row?: boolean;
}
const CoreBlockRow = ({ children, ...restProps }: CoreBlockRowProps) => {
	return <StyledRow {...restProps}>{children}</StyledRow>;
};

export default CoreBlockRow;
