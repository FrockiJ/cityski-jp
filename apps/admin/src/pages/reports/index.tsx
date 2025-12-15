import { useState } from 'react';
import { Box, Stack, Typography, Button } from '@mui/material';
import { FileDownload } from '@mui/icons-material';

import MonthlyClassesCard from '@/components/Project/report/MonthlyClassesCard';
import MonthlyQuotaCard from '@/components/Project/report/MonthlyQuotaCard';
import AnnualCourseStatsCard from '@/components/Project/report/AnnualCourseStatsCard';
import DepartmentPerformanceCard from '@/components/Project/report/DepartmentPerformanceCard';
import ExportReportModal from '@/components/ExportReportModal';
import InstructorScheduleModal from '@/components/InstructorScheduleModal';
import { exportGroupList, exportInstructorSchedule } from '@/utils/http/api/reports';

export default function CourseStatistics() {
	const [exportModalOpen, setExportModalOpen] = useState(false);
	const [instructorScheduleModalOpen, setInstructorScheduleModalOpen] = useState(false);

	const handleExportConfirm = async (reportType: string) => {
		try {
			if (reportType === 'group-list') {
				await exportGroupList();
			}
		} catch (error) {
			console.error('匯出報表失敗:', error);
			// 可以在這裡添加錯誤提示
		}
	};

	const handleInstructorScheduleSelect = () => {
		setInstructorScheduleModalOpen(true);
	};

	const handleInstructorScheduleConfirm = async (year: number, month: number) => {
		try {
			await exportInstructorSchedule(year, month);
		} catch (error) {
			console.error('匯出教練總排堂表失敗:', error);
			// 可以在這裡添加錯誤提示
		}
	};
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
					onClick={() => setExportModalOpen(true)}
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
				<AnnualCourseStatsCard />
				<DepartmentPerformanceCard />
			</Stack>

			{/* Export Modal */}
			<ExportReportModal
				open={exportModalOpen}
				onClose={() => setExportModalOpen(false)}
				onConfirm={handleExportConfirm}
				onInstructorScheduleSelect={handleInstructorScheduleSelect}
			/>

			{/* Instructor Schedule Modal */}
			<InstructorScheduleModal
				open={instructorScheduleModalOpen}
				onClose={() => setInstructorScheduleModalOpen(false)}
				onConfirm={handleInstructorScheduleConfirm}
			/>
		</Box>
	);
}
