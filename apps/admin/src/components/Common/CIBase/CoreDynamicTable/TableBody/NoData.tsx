import { TableCell, TableRow } from '@mui/material';

interface NoDataProps {
	text?: string;
}

const NoData = ({ text }: NoDataProps) => {
	return (
		<TableRow style={{ height: 50 }}>
			<TableCell
				colSpan={100}
				style={{
					textAlign: 'center',
					borderBottom: 'none',
					color: '#000',
					fontSize: 14,
					fontFamily: 'Public Sans',
				}}
			>
				{text ? text : 'No data matches the query.'}
			</TableCell>
		</TableRow>
	);
};

export default NoData;
