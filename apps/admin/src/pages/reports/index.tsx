import { Box } from '@mui/material';

import CustomLineChart from '@/components/Charts/LineChart';
import CustomPieChart from '@/components/Charts/PieChart';

export default function CourseStatistics() {
	return (
		<Box display={'flex'} gap={'20px'}>
			<CustomPieChart />
			<CustomLineChart />
		</Box>
	);
}
