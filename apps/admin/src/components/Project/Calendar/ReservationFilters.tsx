import React from 'react';
import { Box, Chip,FormControl, InputLabel, MenuItem, Select, Stack, TextField, Typography } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';

import { CourseType } from '@/shared/core/constants/enum';

interface Department {
	id: string;
	name: string;
}

interface Instructor {
	id: string;
	name: string;
}

interface FilterState {
	branchId: string;
	startDate: Dayjs;
	endDate: Dayjs;
	courseType?: CourseType;
	instructorId?: string;
}

interface ReservationFiltersProps {
	filters: FilterState;
	departments: Department[];
	instructors: Instructor[];
	onFiltersChange: (filters: FilterState) => void;
}

const ReservationFilters: React.FC<ReservationFiltersProps> = ({
	filters,
	departments,
	instructors,
	onFiltersChange,
}) => {
	const handleFilterChange = (field: keyof FilterState, value: any) => {
		onFiltersChange({
			...filters,
			[field]: value,
		});
	};

	const getCourseTypeText = (type: CourseType) => {
		switch (type) {
			case CourseType.PRIVATE:
				return '私人課程';
			case CourseType.GROUP:
				return '團體課程';
			case CourseType.TRAINING:
				return '個人練習';
			default:
				return '未知';
		}
	};

	const getCourseTypeColor = (
		type: CourseType,
	): {
		backgroundColor: string;
		color: string;
		border: string;
	} => {
		switch (type) {
			case CourseType.PRIVATE:
				return {
					backgroundColor: 'rgba(255, 171, 0, 0.24)',
					color: '#B76E00',
					border: '1px solid rgba(255, 171, 0, 0.32)',
				};
			case CourseType.GROUP:
				return {
					backgroundColor: 'rgba(0, 184, 217, 0.24)',
					color: '#006C9C',
					border: '1px solid rgba(0, 184, 217, 0.32)',
				};
			case CourseType.TRAINING:
				return {
					backgroundColor: 'rgba(54, 179, 126, 0.24)',
					color: '#1B806A',
					border: '1px solid rgba(54, 179, 126, 0.32)',
				};
			default:
				return {
					backgroundColor: 'rgba(145, 158, 171, 0.24)',
					color: '#919EAB',
					border: '1px solid rgba(145, 158, 171, 0.32)',
				};
		}
	};

	return (
		<Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
			<Typography variant='h6' gutterBottom>
				預約行事曆篩選
			</Typography>

			<Stack direction='row' spacing={2} flexWrap='wrap' gap={1}>
				{/* 分店篩選 - 必選 */}
				<FormControl size='small' sx={{ minWidth: 140 }}>
					<InputLabel required>分店</InputLabel>
					<Select
						value={filters.branchId}
						label='分店'
						required
						onChange={(e) => handleFilterChange('branchId', e.target.value)}
					>
						{departments.map((dept) => (
							<MenuItem key={dept.id} value={dept.id}>
								{dept.name}
							</MenuItem>
						))}
					</Select>
				</FormControl>

				{/* 開始日期 */}
				<TextField
					label='開始日期'
					type='date'
					size='small'
					value={filters.startDate.format('YYYY-MM-DD')}
					onChange={(e) => handleFilterChange('startDate', dayjs(e.target.value))}
					InputLabelProps={{ shrink: true }}
					sx={{ minWidth: 140 }}
				/>

				{/* 結束日期 */}
				<TextField
					label='結束日期'
					type='date'
					size='small'
					value={filters.endDate.format('YYYY-MM-DD')}
					onChange={(e) => handleFilterChange('endDate', dayjs(e.target.value))}
					InputLabelProps={{ shrink: true }}
					sx={{ minWidth: 140 }}
				/>

				{/* 課程類型 */}
				<FormControl size='small' sx={{ minWidth: 140 }}>
					<InputLabel>課程類型</InputLabel>
					<Select
						value={filters.courseType || ''}
						label='課程類型'
						onChange={(e) => handleFilterChange('courseType', e.target.value || undefined)}
					>
						<MenuItem value=''>全部</MenuItem>
						<MenuItem value={CourseType.PRIVATE}>私人課程</MenuItem>
						<MenuItem value={CourseType.GROUP}>團體課程</MenuItem>
						<MenuItem value={CourseType.TRAINING}>個人練習</MenuItem>
					</Select>
				</FormControl>

				{/* 教練篩選 */}
				<FormControl size='small' sx={{ minWidth: 140 }}>
					<InputLabel>教練</InputLabel>
					<Select
						value={filters.instructorId || ''}
						label='教練'
						onChange={(e) => handleFilterChange('instructorId', e.target.value || undefined)}
					>
						<MenuItem value=''>全部教練</MenuItem>
						{instructors.map((instructor) => (
							<MenuItem key={instructor.id} value={instructor.id}>
								{instructor.name}
							</MenuItem>
						))}
					</Select>
				</FormControl>
			</Stack>

			{/* 篩選條件顯示 */}
			<Stack direction='row' spacing={1} mt={2} flexWrap='wrap'>
				{filters.courseType && (
					<Chip
						label={getCourseTypeText(filters.courseType)}
						size='small'
						sx={getCourseTypeColor(filters.courseType)}
						onDelete={() => handleFilterChange('courseType', undefined)}
					/>
				)}

				{filters.instructorId && (
					<Chip
						label={`教練: ${instructors.find((i) => i.id === filters.instructorId)?.name || '未知'}`}
						size='small'
						variant='outlined'
						onDelete={() => handleFilterChange('instructorId', undefined)}
					/>
				)}
			</Stack>
		</Box>
	);
};

export default ReservationFilters;
