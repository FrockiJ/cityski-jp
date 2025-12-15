import { Box, Stack } from '@mui/material';

import MonthlyClassesCard from '@/components/Project/report/MonthlyClassesCard';
import MonthlyQuotaCard from '@/components/Project/report/MonthlyQuotaCard';
import CustomLineChart from '@/components/Charts/LineChart';
import CustomPieChart from '@/components/Charts/PieChart';

export default function CourseStatistics() {
	return (
		<Box
			sx={{
				width: '100%',
				display: 'flex',
				flexDirection: 'column',
				gap: 3,
				padding: 3,
			}}
		>
			{/* Top Row - Stats Cards */}
			<Stack direction="row" spacing={2.5} sx={{ width: '100%' }}>
				<Box sx={{ flex: 1 }}>
					<MonthlyClassesCard />
				</Box>
				<Box sx={{ flex: 1 }}>
					<MonthlyQuotaCard />
				</Box>
			</Stack>

			{/* Bottom Row - Charts */}
			<Stack direction="row" spacing={2.5} sx={{ width: '100%' }}>
				<Box sx={{ flex: 1 }}>
					<CustomPieChart />
				</Box>
				<Box sx={{ flex: 1 }}>
					<CustomLineChart />
				</Box>
			</Stack>
		</Box>
	);
}
