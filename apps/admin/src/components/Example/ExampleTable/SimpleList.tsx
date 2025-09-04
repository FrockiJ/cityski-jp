import CoreTableCell from '@/CIBase/CoreTable/CoreTableBody/CoreTableCell';
import CoreTableRow from '@/CIBase/CoreTable/CoreTableBody/CoreTableRow';
import { TableDataResult } from '@/shared/types/apiModels';
interface SimpleListProps {
	rows: TableDataResult[];
}

const SimpleList = ({ rows }: SimpleListProps) => {
	return (
		<>
			{rows.map((row) => (
				<CoreTableRow key={row._id}>
					<CoreTableCell>{row.conference}</CoreTableCell>
					<CoreTableCell>{row.division}</CoreTableCell>
					<CoreTableCell>{row.created}</CoreTableCell>
					<CoreTableCell>{row.team}</CoreTableCell>
					<CoreTableCell>{row.coach}</CoreTableCell>
				</CoreTableRow>
			))}
		</>
	);
};

export default SimpleList;
