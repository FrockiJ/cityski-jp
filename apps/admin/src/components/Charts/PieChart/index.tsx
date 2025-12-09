'use client';

import { useState } from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Box, CardContent, Divider, MenuItem, SelectChangeEvent, Typography } from '@mui/material';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';

import {
	CenterTextContainer,
	ChartContainer,
	LegendContainer,
	LegendDot,
	LegendItem,
	StyledCard,
	StyledSelect,
} from './styles';

const dataByYear: Record<string, { name: string; value: number; color: string }[]> = {
	'2024': [
		{ name: '指定', value: 350, color: '#34C38F' },
		{ name: '預約', value: 280, color: '#F7B84B' },
		{ name: '個人練習', value: 157, color: '#F06548' },
		{ name: '單堂體驗', value: 150, color: '#50C3E6' },
	],
	'2023': [
		{ name: '指定', value: 280, color: '#34C38F' },
		{ name: '預約', value: 320, color: '#F7B84B' },
		{ name: '個人練習', value: 120, color: '#F06548' },
		{ name: '單堂體驗', value: 180, color: '#50C3E6' },
	],
	'2022': [
		{ name: '指定', value: 200, color: '#34C38F' },
		{ name: '預約', value: 250, color: '#F7B84B' },
		{ name: '個人練習', value: 100, color: '#F06548' },
		{ name: '單堂體驗', value: 130, color: '#50C3E6' },
	],
};

const YEARS = ['2024', '2023', '2022'];

export default function CustomPieChart() {
	const [year, setYear] = useState('2024');

	const data = dataByYear[year];
	const total = data.reduce((sum, item) => sum + item.value, 0);

	const handleYearChange = (event: SelectChangeEvent<unknown>) => {
		setYear(event.target.value as string);
	};

	return (
		<StyledCard>
			<CardContent sx={{ p: 1 }}>
				{/* Header */}
				<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, p: 2 }}>
					<Typography variant='h6' fontWeight={600}>
						年度課程統計
					</Typography>

					<StyledSelect value={year} onChange={handleYearChange} size='small' IconComponent={KeyboardArrowDownIcon}>
						{YEARS.map((y) => (
							<MenuItem key={y} value={y}>
								{y}
							</MenuItem>
						))}
					</StyledSelect>
				</Box>

				{/* Donut Chart */}
				<ChartContainer>
					<ResponsiveContainer width='100%' height='100%'>
						<PieChart>
							<Pie
								data={data}
								cx='50%'
								cy='50%'
								innerRadius={110}
								outerRadius={120}
								paddingAngle={2}
								dataKey='value'
								animationBegin={0}
								animationDuration={800}
							>
								{data.map((entry, index) => (
									<Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
								))}
							</Pie>
						</PieChart>
					</ResponsiveContainer>

					{/* Center Text */}
					<CenterTextContainer>
						<Typography variant='body2' color='grey.600' fontWeight={500}>
							總共
						</Typography>
						<Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 0.5 }}>
							<Typography variant='h3' fontWeight={700}>
								{total}
							</Typography>
							<Typography variant='h6' color='grey.800' fontWeight={400}>
								堂
							</Typography>
						</Box>
					</CenterTextContainer>
				</ChartContainer>
				<Divider />
				{/* Legend */}
				<LegendContainer>
					{data.map((item, index) => (
						<LegendItem key={index}>
							<LegendDot dotColor={item.color} />
							<Typography variant='body2' color='text.secondary'>
								{item.name}
							</Typography>
						</LegendItem>
					))}
				</LegendContainer>
			</CardContent>
		</StyledCard>
	);
}
