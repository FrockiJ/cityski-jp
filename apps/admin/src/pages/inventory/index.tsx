import { useState, useMemo } from 'react';
import {
	Box,
	Typography,
	TextField,
	Button,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	InputAdornment,
	Drawer,
	IconButton,
	CircularProgress,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import CloseIcon from '@mui/icons-material/Close';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ClearIcon from '@mui/icons-material/Clear';
import { useInventory } from '@/hooks/useInventory';

export default function Inventory() {
	const [filterOpen, setFilterOpen] = useState(false);
	const [fromDate, setFromDate] = useState('');
	const [toDate, setToDate] = useState('');
	const [searchQuery, setSearchQuery] = useState('');
	const [sortBy, setSortBy] = useState<string>('totalAmount');
	const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

	// Fetch inventory data
	const { data, loading, summary, dateRange, refetch } = useInventory({
		fromDate,
		toDate,
		sortBy,
		sortOrder,
	});

	// Get unique month columns from data
	const monthColumns = useMemo(() => {
		const months = new Set<string>();
		data.forEach((item) => {
			Object.keys(item.monthlyUsage).forEach((month) => months.add(month));
		});
		return Array.from(months).sort();
	}, [data]);

	// Filter data based on search query
	const filteredData = useMemo(() => {
		if (!searchQuery) return data;
		const query = searchQuery.toLowerCase();
		return data.filter(
			(item) =>
				item.customerName.toLowerCase().includes(query) ||
				item.customerPhone.includes(query) ||
				item.orderNo.toLowerCase().includes(query)
		);
	}, [data, searchQuery]);

	// Group data by customer for display
	const groupedData = useMemo(() => {
		const groups = new Map<
			string,
			{
				customerName: string;
				customerPhone: string;
				items: typeof filteredData;
			}
		>();

		filteredData.forEach((item) => {
			const key = `${item.customerName}-${item.customerPhone}`;
			if (!groups.has(key)) {
				groups.set(key, {
					customerName: item.customerName,
					customerPhone: item.customerPhone,
					items: [],
				});
			}
			groups.get(key)?.items.push(item);
		});

		return Array.from(groups.values());
	}, [filteredData]);

	const handleClearFilters = () => {
		setFromDate('');
		setToDate('');
		refetch({ sortBy, sortOrder });
	};

	const handleApplyFilters = () => {
		refetch({ fromDate, toDate, sortBy, sortOrder });
		setFilterOpen(false);
	};

	const handleSort = (column: string) => {
		const newOrder = sortBy === column && sortOrder === 'desc' ? 'asc' : 'desc';
		setSortBy(column);
		setSortOrder(newOrder);
		refetch({ fromDate, toDate, sortBy: column, sortOrder: newOrder });
	};

	const formatCurrency = (amount: number) => {
		return `$${amount.toLocaleString()}`;
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
			{/* Header with Export Button */}
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
				}}
			>
				<Typography
					variant="h4"
					fontWeight={700}
					color="text.primary"
					sx={{ fontFamily: 'Public Sans' }}
				>
					清冊
				</Typography>
				<Button
					variant="contained"
					color="primary"
					startIcon={<FileDownloadIcon />}
					sx={{
						borderRadius: 2,
						textTransform: 'none',
						fontWeight: 700,
						fontFamily: 'Public Sans',
					}}
				>
					匯出顯示清冊
				</Button>
			</Box>

			{/* Table Container */}
			<Paper
				sx={{
					borderRadius: 4,
					boxShadow: '0px 12px 24px -4px rgba(145,158,171,0.12), 0px 0px 2px 0px rgba(145,158,171,0.20)',
					overflow: 'hidden',
				}}
			>
				{/* Search and Filter Bar */}
				<Box
					sx={{
						px: 3,
						py: 2.5,
						display: 'flex',
						alignItems: 'center',
						gap: 2,
					}}
				>
					<TextField
						placeholder="搜尋學員、手機或訂單編號"
						size="small"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						sx={{
							width: 288,
							'& .MuiOutlinedInput-root': {
								borderRadius: 2,
								fontFamily: 'Public Sans',
							},
						}}
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<SearchIcon sx={{ color: 'text.disabled' }} />
								</InputAdornment>
							),
						}}
					/>
					<Button
						variant="text"
						startIcon={<FilterListIcon />}
						onClick={() => setFilterOpen(true)}
						sx={{
							textTransform: 'none',
							fontFamily: 'Public Sans',
							fontSize: 12,
						}}
					>
						篩選
					</Button>
				</Box>

				{/* Table */}
				<TableContainer sx={{ maxHeight: 'calc(100vh - 300px)' }}>
					<Table stickyHeader>
						<TableHead>
							<TableRow>
								<TableCell
									sx={{
										bgcolor: 'grey.100',
										fontWeight: 600,
										fontFamily: 'Public Sans',
										borderRight: '2px solid',
										borderColor: 'grey.300',
										minWidth: 112,
									}}
								>
									訂購人
								</TableCell>
								<TableCell
									sx={{
										bgcolor: 'grey.100',
										fontWeight: 600,
										fontFamily: 'Public Sans',
										borderRight: '2px solid',
										borderColor: 'grey.300',
										minWidth: 128,
									}}
								>
									訂單(人數)
								</TableCell>
								<TableCell
									onClick={() => handleSort('totalAmount')}
									sx={{
										bgcolor: 'grey.100',
										fontWeight: 600,
										fontFamily: 'Public Sans',
										borderRight: '2px solid',
										borderColor: 'grey.300',
										minWidth: 96,
										cursor: 'pointer',
										userSelect: 'none',
									}}
								>
									<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
										總金額
										{sortBy === 'totalAmount' &&
											(sortOrder === 'desc' ? (
												<ArrowDownwardIcon sx={{ fontSize: 16, color: 'grey.500' }} />
											) : (
												<ArrowUpwardIcon sx={{ fontSize: 16, color: 'grey.500' }} />
											))}
									</Box>
								</TableCell>
								<TableCell
									onClick={() => handleSort('balance')}
									sx={{
										bgcolor: 'grey.100',
										fontWeight: 600,
										fontFamily: 'Public Sans',
										borderRight: '2px solid',
										borderColor: 'grey.300',
										minWidth: 88,
										cursor: 'pointer',
										userSelect: 'none',
									}}
								>
									<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
										餘額
										{sortBy === 'balance' &&
											(sortOrder === 'desc' ? (
												<ArrowDownwardIcon sx={{ fontSize: 16, color: 'grey.500' }} />
											) : (
												<ArrowUpwardIcon sx={{ fontSize: 16, color: 'grey.500' }} />
											))}
									</Box>
								</TableCell>
								{monthColumns.map((month) => (
									<TableCell
										key={month}
										onClick={() => handleSort(month)}
										sx={{
											bgcolor: 'grey.100',
											fontWeight: 600,
											fontFamily: 'Public Sans',
											borderRight: '2px solid',
											borderColor: 'grey.300',
											minWidth: 96,
											cursor: 'pointer',
											userSelect: 'none',
										}}
									>
										<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
											{month}
											{sortBy === month &&
												(sortOrder === 'desc' ? (
													<ArrowDownwardIcon sx={{ fontSize: 16, color: 'grey.500' }} />
												) : (
													<ArrowUpwardIcon sx={{ fontSize: 16, color: 'grey.500' }} />
												))}
										</Box>
									</TableCell>
								))}
								<TableCell sx={{ bgcolor: 'grey.100' }} />
							</TableRow>
						</TableHead>
						<TableBody>
							{loading ? (
								<TableRow>
									<TableCell colSpan={4 + monthColumns.length + 1} align="center" sx={{ py: 4 }}>
										<CircularProgress />
									</TableCell>
								</TableRow>
							) : groupedData.length === 0 ? (
								<TableRow>
									<TableCell colSpan={4 + monthColumns.length + 1} align="center" sx={{ py: 4 }}>
										<Typography variant="body2" color="text.secondary">
											無資料
										</Typography>
									</TableCell>
								</TableRow>
							) : (
								groupedData.map((group, groupIndex) => {
									return group.items.map((item, itemIndex) => (
										<TableRow key={`${groupIndex}-${itemIndex}`}>
											{itemIndex === 0 ? (
												<TableCell
													rowSpan={group.items.length}
													sx={{
														borderBottom: '1px solid',
														borderColor: 'divider',
														fontFamily: 'Public Sans',
														verticalAlign: 'top',
														py: 1.25,
													}}
												>
													<Typography
														variant="body2"
														sx={{ fontFamily: 'Public Sans', lineHeight: '20px' }}
													>
														{group.customerName}
													</Typography>
													<Typography
														variant="caption"
														sx={{
															fontFamily: 'Public Sans',
															fontSize: 12,
															lineHeight: '16px',
															overflow: 'hidden',
															textOverflow: 'ellipsis',
															whiteSpace: 'nowrap',
														}}
													>
														{group.customerPhone}
													</Typography>
												</TableCell>
											) : null}
											<TableCell
												sx={{
													borderBottom: '1px solid',
													borderColor: 'divider',
													fontFamily: 'Public Sans',
													py: 1.25,
												}}
											>
												<Typography
													variant="body2"
													color="primary"
													sx={{ fontFamily: 'Public Sans', lineHeight: '20px' }}
												>
													{item.courseName}({item.participantCount})
												</Typography>
												<Typography
													variant="caption"
													color="primary"
													sx={{
														fontFamily: 'Public Sans',
														fontSize: 12,
														lineHeight: '16px',
														overflow: 'hidden',
														textOverflow: 'ellipsis',
														whiteSpace: 'nowrap',
													}}
												>
													{item.orderNo}
												</Typography>
											</TableCell>
											<TableCell
												sx={{
													borderBottom: '1px solid',
													borderColor: 'divider',
													fontFamily: 'Public Sans',
													py: 1.25,
												}}
											>
												<Typography variant="body2" sx={{ fontFamily: 'Public Sans' }}>
													{formatCurrency(item.totalAmount)}
												</Typography>
											</TableCell>
											<TableCell
												sx={{
													borderBottom: '1px solid',
													borderColor: 'divider',
													fontFamily: 'Public Sans',
													py: 1.25,
												}}
											>
												<Typography variant="body2" sx={{ fontFamily: 'Public Sans' }}>
													{formatCurrency(item.balance)}
												</Typography>
											</TableCell>
											{monthColumns.map((month) => (
												<TableCell
													key={month}
													sx={{
														borderBottom: '1px solid',
														borderColor: 'divider',
														fontFamily: 'Public Sans',
														py: 1.25,
													}}
												>
													<Typography variant="body2" sx={{ fontFamily: 'Public Sans' }}>
														{item.monthlyUsage[month]
															? formatCurrency(item.monthlyUsage[month])
															: '--'}
													</Typography>
												</TableCell>
											))}
											<TableCell
												sx={{
													borderBottom: '1px solid',
													borderColor: 'divider',
												}}
											/>
										</TableRow>
									));
								})
							)}
						</TableBody>
					</Table>
				</TableContainer>

				{/* Footer Summary */}
				<Box
					sx={{
						height: 56,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'flex-end',
						bgcolor: 'background.paper',
						boxShadow: '0px 0px 2px 0px rgba(145,158,171,0.20), 0px 12px 24px -4px rgba(145,158,171,0.12)',
						px: 3,
						gap: 2,
					}}
				>
					<Typography
						variant="body2"
						fontWeight={600}
						sx={{ fontFamily: 'Public Sans' }}
					>
						共{summary.totalCount}筆
					</Typography>
					<Box sx={{ width: '2px', height: 16, bgcolor: 'grey.300' }} />
					<Typography
						variant="body2"
						fontWeight={600}
						sx={{ fontFamily: 'Public Sans' }}
					>
						總金額{formatCurrency(summary.totalAmount)}
					</Typography>
					<Box sx={{ width: '2px', height: 16, bgcolor: 'grey.300' }} />
					<Typography
						variant="body2"
						fontWeight={600}
						sx={{ fontFamily: 'Public Sans' }}
					>
						總餘額{formatCurrency(summary.totalBalance)}
					</Typography>
				</Box>
			</Paper>

			{/* Filter Drawer */}
			<Drawer
				anchor="right"
				open={filterOpen}
				onClose={() => setFilterOpen(false)}
				PaperProps={{
					sx: {
						width: 288,
						boxShadow: '0px 24px 48px 0px rgba(145,158,171,0.16)',
					},
				}}
			>
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column',
						height: '100%',
					}}
				>
					{/* Header */}
					<Box
						sx={{
							px: 3,
							pr: 1,
							py: 2,
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center',
							borderBottom: '1px solid',
							borderColor: 'rgba(145,158,171,0.24)',
						}}
					>
						<Typography
							variant="body1"
							fontWeight={600}
							sx={{ fontFamily: 'Public Sans' }}
						>
							篩選
						</Typography>
						<IconButton
							size="small"
							onClick={() => setFilterOpen(false)}
							sx={{ color: 'action.active' }}
						>
							<CloseIcon />
						</IconButton>
					</Box>

					{/* Filter Content */}
					<Box
						sx={{
							flex: 1,
							px: 2.5,
							pt: 3,
							display: 'flex',
							flexDirection: 'column',
							gap: 2,
						}}
					>
						<Typography
							variant="body2"
							fontWeight={600}
							sx={{ fontFamily: 'Public Sans' }}
						>
							顯示區間
						</Typography>

						{/* From Date */}
						<Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
							<TextField
								label="從"
								placeholder="yyyy/mm"
								size="small"
								value={fromDate}
								onChange={(e) => setFromDate(e.target.value)}
								sx={{
									'& .MuiOutlinedInput-root': {
										borderRadius: 2,
										fontFamily: 'Public Sans',
									},
									'& .MuiInputLabel-root': {
										fontFamily: 'Public Sans',
										fontSize: 14,
									},
								}}
								InputProps={{
									endAdornment: (
										<InputAdornment position="end">
											<IconButton edge="end" size="small">
												<CalendarMonthIcon />
											</IconButton>
										</InputAdornment>
									),
								}}
							/>

							{/* To Date */}
							<TextField
								label="到"
								placeholder="yyyy/mm"
								size="small"
								value={toDate}
								onChange={(e) => setToDate(e.target.value)}
								sx={{
									'& .MuiOutlinedInput-root': {
										borderRadius: 2,
										fontFamily: 'Public Sans',
									},
									'& .MuiInputLabel-root': {
										fontFamily: 'Public Sans',
										fontSize: 14,
									},
								}}
								InputProps={{
									endAdornment: (
										<InputAdornment position="end">
											<IconButton edge="end" size="small">
												<CalendarMonthIcon />
											</IconButton>
										</InputAdornment>
									),
								}}
							/>
						</Box>
					</Box>

					{/* Footer */}
					<Box
						sx={{
							p: 1,
							bgcolor: 'background.paper',
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							gap: 1,
						}}
					>
						<Button
							variant="contained"
							color="primary"
							onClick={handleApplyFilters}
							sx={{
								width: 224,
								borderRadius: 2,
								textTransform: 'none',
								fontWeight: 700,
								fontFamily: 'Public Sans',
							}}
						>
							套用
						</Button>
						<Button
							variant="outlined"
							startIcon={<ClearIcon />}
							onClick={handleClearFilters}
							sx={{
								width: 224,
								borderRadius: 2,
								textTransform: 'none',
								fontWeight: 700,
								fontFamily: 'Public Sans',
								borderColor: 'rgba(145,158,171,0.3)',
								color: 'text.primary',
								'&:hover': {
									borderColor: 'rgba(145,158,171,0.5)',
								},
							}}
						>
							清除條件
						</Button>
					</Box>
				</Box>
			</Drawer>
		</Box>
	);
}
