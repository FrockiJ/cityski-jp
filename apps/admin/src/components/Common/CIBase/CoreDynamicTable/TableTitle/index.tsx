import { StyledTableTitle } from '../styles';

type TableTitleProps = {
	children: React.ReactNode;
};
const TableTitle = ({ children }: TableTitleProps) => {
	return <StyledTableTitle>{children}</StyledTableTitle>;
};

export default TableTitle;
