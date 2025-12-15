import { Box, Stack, Typography, Button } from '@mui/material';
import { FileDownload } from '@mui/icons-material';

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
			{/* Header */}
			<Stack 
				direction="row" 
				justifyContent="space-between" 
				alignItems="center"
				sx={{ width: '100%' }}
			>
				<Typography 
					variant="h4" 
					fontWeight={700}
					color="text.primary"
					sx={{ fontFamily: 'Public Sans' }}
				>
					報表
				</Typography>
				<Button
					variant="contained"
					startIcon={<FileDownload />}
					sx={{
						px: 2,
						py: 0.75,
						bgcolor: 'primary.main',
						borderRadius: 2,
						fontSize: 14,
						fontWeight: 700,
						fontFamily: 'Public Sans',
						color: 'common.white',
						textTransform: 'none',
						'&:hover': {
							bgcolor: 'primary.dark',
						},
					}}
				>
					匯出報表
				</Button>
			</Stack>

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
