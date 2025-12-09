'use client';

import { useState } from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Box, CardContent, MenuItem, SelectChangeEvent, Typography } from '@mui/material';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { ChartContainer, LegendContainer, LegendDot, LegendItem, StyledCard, StyledSelect } from './styles';

const dataByYear: Record<string, { month: string; 台中店: number; 新竹店: number; 高雄店: number }[]> = {
	'2024': [
		{ month: '一月', 台中店: 30, 新竹店: 25, 高雄店: 18 },
		{ month: '二月', 台中店: 35, 新竹店: 30, 高雄店: 22 },
		{ month: '三月', 台中店: 48, 新竹店: 42, 高雄店: 28 },
		{ month: '四月', 台中店: 38, 新竹店: 55, 高雄店: 35 },
		{ month: '五月', 台中店: 35, 新竹店: 75, 高雄店: 42 },
		{ month: '六月', 台中店: 40, 新竹店: 80, 高雄店: 45 },
		{ month: '七月', 台中店: 38, 新竹店: 78, 高雄店: 42 },
		{ month: '八月', 台中店: 42, 新竹店: 82, 高雄店: 45 },
		{ month: '九月', 台中店: 50, 新竹店: 88, 高雄店: 55 },
		{ month: '十月', 台中店: 35, 新竹店: 95, 高雄店: 68 },
		{ month: '十一月', 台中店: 18, 新竹店: 75, 高雄店: 52 },
		{ month: '十二月', 台中店: 15, 新竹店: 62, 高雄店: 38 },
	],
	'2023': [
		{ month: '一月', 台中店: 25, 新竹店: 20, 高雄店: 15 },
		{ month: '二月', 台中店: 30, 新竹店: 28, 高雄店: 20 },
		{ month: '三月', 台中店: 40, 新竹店: 35, 高雄店: 25 },
		{ month: '四月', 台中店: 35, 新竹店: 48, 高雄店: 30 },
		{ month: '五月', 台中店: 32, 新竹店: 65, 高雄店: 38 },
		{ month: '六月', 台中店: 38, 新竹店: 72, 高雄店: 42 },
		{ month: '七月', 台中店: 35, 新竹店: 70, 高雄店: 40 },
		{ month: '八月', 台中店: 40, 新竹店: 75, 高雄店: 43 },
		{ month: '九月', 台中店: 45, 新竹店: 80, 高雄店: 50 },
		{ month: '十月', 台中店: 30, 新竹店: 85, 高雄店: 60 },
		{ month: '十一月', 台中店: 15, 新竹店: 68, 高雄店: 48 },
		{ month: '十二月', 台中店: 12, 新竹店: 55, 高雄店: 35 },
	],
	'2022': [
		{ month: '一月', 台中店: 20, 新竹店: 18, 高雄店: 12 },
		{ month: '二月', 台中店: 25, 新竹店: 22, 高雄店: 18 },
		{ month: '三月', 台中店: 35, 新竹店: 30, 高雄店: 22 },
		{ month: '四月', 台中店: 30, 新竹店: 42, 高雄店: 28 },
		{ month: '五月', 台中店: 28, 新竹店: 58, 高雄店: 35 },
		{ month: '六月', 台中店: 32, 新竹店: 65, 高雄店: 38 },
		{ month: '七月', 台中店: 30, 新竹店: 62, 高雄店: 36 },
		{ month: '八月', 台中店: 35, 新竹店: 68, 高雄店: 40 },
		{ month: '九月', 台中店: 40, 新竹店: 72, 高雄店: 45 },
		{ month: '十月', 台中店: 25, 新竹店: 78, 高雄店: 55 },
		{ month: '十一月', 台中店: 12, 新竹店: 60, 高雄店: 42 },
		{ month: '十二月', 台中店: 10, 新竹店: 48, 高雄店: 30 },
	],
};

const stores = [
	{ key: '台中店', color: '#34C38F' },
	{ key: '新竹店', color: '#50C3E6' },
	{ key: '高雄店', color: '#F7B84B' },
];

const YEARS = ['2024', '2023', '2022'];

export default function CustomLineChart() {
	const [year, setYear] = useState('2024');

	const data = dataByYear[year];

	const handleYearChange = (event: SelectChangeEvent<unknown>) => {
		setYear(event.target.value as string);
	};

	return (
		<StyledCard>
			<CardContent sx={{ p: 1 }}>
				{/* Header */}
				<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2, p: 2 }}>
					<Typography variant='h6' fontWeight={600}>
						各部門業績
					</Typography>

					<StyledSelect value={year} onChange={handleYearChange} size='small' IconComponent={KeyboardArrowDownIcon}>
						{YEARS.map((y) => (
							<MenuItem key={y} value={y}>
								{y}
							</MenuItem>
						))}
					</StyledSelect>
				</Box>

				{/* Legend */}
				<LegendContainer>
					{stores.map((store) => (
						<LegendItem key={store.key}>
							<LegendDot dotColor={store.color} />
							<Typography variant='body2' color='text.secondary'>
								{store.key}
							</Typography>
						</LegendItem>
					))}
				</LegendContainer>

				{/* Chart */}
				<ChartContainer>
					<ResponsiveContainer width='100%' height='100%'>
						<AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
							<defs>
								{stores.map((store) => (
									<linearGradient key={store.key} id={`gradient${store.key}`} x1='0' y1='0' x2='0' y2='1'>
										<stop offset='5%' stopColor={store.color} stopOpacity={0.4} />
										<stop offset='95%' stopColor={store.color} stopOpacity={0.1} />
									</linearGradient>
								))}
							</defs>
							<XAxis
								dataKey='month'
								axisLine={false}
								tickLine={false}
								tick={{ fill: '#9e9e9e', fontSize: 13 }}
								dy={10}
							/>
							<YAxis
								axisLine={false}
								tickLine={false}
								tick={{ fill: '#9e9e9e', fontSize: 13 }}
								domain={[0, 100]}
								ticks={[0, 20, 40, 60, 80, 100]}
								dx={-10}
							/>
							<Tooltip
								contentStyle={{
									backgroundColor: '#fff',
									border: 'none',
									borderRadius: '8px',
									boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
									padding: '12px 16px',
								}}
								labelStyle={{ color: '#424242', fontWeight: 600, marginBottom: '8px' }}
								itemStyle={{ color: '#616161', padding: '2px 0' }}
							/>

							{stores.map((store) => (
								<Area
									key={store.key}
									type='monotone'
									dataKey={store.key}
									stroke={store.color}
									strokeWidth={3}
									fill={`url(#gradient${store.key})`}
									animationDuration={1000}
									animationEasing='ease-out'
								/>
							))}
						</AreaChart>
					</ResponsiveContainer>
				</ChartContainer>
			</CardContent>
		</StyledCard>
	);
}
