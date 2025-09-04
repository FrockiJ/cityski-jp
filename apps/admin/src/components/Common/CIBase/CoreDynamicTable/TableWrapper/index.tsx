import { StyledTableWrapper } from '../styles';

type TableWrapperProps = {
	children: React.ReactNode;
};
const TableWrapper = ({ children }: TableWrapperProps) => {
	return <StyledTableWrapper>{children}</StyledTableWrapper>;
};

export default TableWrapper;
