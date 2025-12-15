import { useState } from 'react';
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
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import CloseIcon from '@mui/icons-material/Close';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ClearIcon from '@mui/icons-material/Clear';

interface InventoryRow {
	customer: { name: string; phone: string };
	orders: { name: string; id: string; count: number }[];
	totalAmount: string;
	balance: string;
	monthly: { [key: string]: string };
}

const mockData: InventoryRow[] = [
	{
		customer: { name: '黃大名', phone: '0912345678' },
		orders: [
			{ name: '私人課教學', id: '00001', count: 3 },
			{ name: '團體課教學', id: '00001', count: 3 },
			{ name: '個人練習', id: '00001', count: 3 },
		],
		totalAmount: '$91,000',
		balance: '$45,000',
		monthly: {
			'2024/01': '--',
			'2024/02': '--',
			'2024/03': '$3,200',
			'2024/04': '$3,200',
			'2024/05': '$3,200',
			'2024/06': '$3,200',
			'2024/07': '$3,200',
		},
	},
	{
		customer: { name: '林小美', phone: '0912345678' },
		orders: [{ name: '團體課教學', id: '00001', count: 3 }],
		totalAmount: '$91,000',
		balance: '$45,000',
		monthly: {
			'2024/01': '--',
			'2024/02': '--',
			'2024/03': '$0',
			'2024/04': '$0',
			'2024/05': '$3,200',
			'2024/06': '$3,200',
			'2024/07': '$3,200',
		},
	},
	{
		customer: { name: '許淨淨', phone: '0912345678' },
		orders: [
			{ name: '團體課教學', id: '00001', count: 3 },
			{ name: '個人練習', id: '00001', count: 3 },
		],
		totalAmount: '$91,000',
		balance: '$0',
		monthly: {
			'2024/01': '$3,200',
			'2024/02': '$3,200',
			'2024/03': '$3,200',
			'2024/04': '--',
			'2024/05': '--',
			'2024/06': '--',
			'2024/07': '$3,200',
		},
	},
	{
		customer: { name: '陳大帥', phone: '0912345678' },
		orders: [{ name: '團體課教學', id: '00001', count: 3 }],
		totalAmount: '$91,000',
		balance: '$45,000',
		monthly: {
			'2024/01': '$3,200',
			'2024/02': '$3,200',
			'2024/03': '$3,200',
			'2024/04': '$3,200',
			'2024/05': '$3,200',
			'2024/06': '$3,200',
			'2024/07': '$3,200',
		},
	},
	{
		customer: { name: '彭于晏', phone: '0912345678' },
		orders: [{ name: '團體課教學', id: '00001', count: 3 }],
		totalAmount: '$91,000',
		balance: '$45,000',
		monthly: {
			'2024/01': '$3,200',
			'2024/02': '$3,200',
			'2024/03': '$3,200',
			'2024/04': '$3,200',
			'2024/05': '$3,200',
			'2024/06': '$3,200',
			'2024/07': '$3,200',
		},
	},
];

const monthColumns = ['2024/01', '2024/02', '2024/03', '2024/04', '2024/05', '2024/06', '2024/07'];

export default function Inventory() {
	const [filterOpen, setFilterOpen] = useState(false);
	const [fromDate, setFromDate] = useState('');
	const [toDate, setToDate] = useState('');

	const handleClearFilters = () => {
		setFromDate('');
		setToDate('');
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
									sx={{
										bgcolor: 'grey.100',
										fontWeight: 600,
										fontFamily: 'Public Sans',
										borderRight: '2px solid',
										borderColor: 'grey.300',
										minWidth: 96,
									}}
								>
									<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
										總金額
										<ArrowDownwardIcon sx={{ fontSize: 16, color: 'grey.500' }} />
									</Box>
								</TableCell>
								<TableCell
									sx={{
										bgcolor: 'grey.100',
										fontWeight: 600,
										fontFamily: 'Public Sans',
										borderRight: '2px solid',
										borderColor: 'grey.300',
										minWidth: 88,
									}}
								>
									餘額
								</TableCell>
								{monthColumns.map((month) => (
									<TableCell
										key={month}
										sx={{
											bgcolor: 'grey.100',
											fontWeight: 600,
											fontFamily: 'Public Sans',
											borderRight: '2px solid',
											borderColor: 'grey.300',
											minWidth: 96,
										}}
									>
										{month}
									</TableCell>
								))}
								<TableCell sx={{ bgcolor: 'grey.100' }} />
							</TableRow>
						</TableHead>
						<TableBody>
							{mockData.map((row, rowIndex) => {
								const rows = row.orders.map((order, orderIndex) => (
									<TableRow key={`${rowIndex}-${orderIndex}`}>
										{orderIndex === 0 ? (
											<TableCell
												rowSpan={row.orders.length}
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
													{row.customer.name}
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
													{row.customer.phone}
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
												{order.name}({order.count})
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
												{order.id}
											</Typography>
										</TableCell>
										{orderIndex === 0 ? (
											<TableCell
												rowSpan={row.orders.length}
												sx={{
													borderBottom: '1px solid',
													borderColor: 'divider',
													fontFamily: 'Public Sans',
													verticalAlign: 'top',
													py: 1.25,
												}}
											>
												<Typography variant="body2" sx={{ fontFamily: 'Public Sans' }}>
													{row.totalAmount}
												</Typography>
											</TableCell>
										) : null}
										{orderIndex === 0 ? (
											<TableCell
												rowSpan={row.orders.length}
												sx={{
													borderBottom: '1px solid',
													borderColor: 'divider',
													fontFamily: 'Public Sans',
													verticalAlign: 'top',
													py: 1.25,
												}}
											>
												<Typography variant="body2" sx={{ fontFamily: 'Public Sans' }}>
													{row.balance}
												</Typography>
											</TableCell>
										) : null}
										{orderIndex === 0
											? monthColumns.map((month) => (
													<TableCell
														key={month}
														rowSpan={row.orders.length}
														sx={{
															borderBottom: '1px solid',
															borderColor: 'divider',
															fontFamily: 'Public Sans',
															verticalAlign: 'top',
															py: 1.25,
														}}
													>
														<Typography variant="body2" sx={{ fontFamily: 'Public Sans' }}>
															{row.monthly[month]}
														</Typography>
													</TableCell>
											  ))
											: null}
										{orderIndex === 0 ? (
											<TableCell
												rowSpan={row.orders.length}
												sx={{
													borderBottom: '1px solid',
													borderColor: 'divider',
												}}
											/>
										) : null}
									</TableRow>
								));
								return rows;
							})}
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
						共500筆
					</Typography>
					<Box sx={{ width: '2px', height: 16, bgcolor: 'grey.300' }} />
					<Typography
						variant="body2"
						fontWeight={600}
						sx={{ fontFamily: 'Public Sans' }}
					>
						總金額$209,300
					</Typography>
					<Box sx={{ width: '2px', height: 16, bgcolor: 'grey.300' }} />
					<Typography
						variant="body2"
						fontWeight={600}
						sx={{ fontFamily: 'Public Sans' }}
					>
						總餘額$98,400
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
