import { Box, Typography } from '@mui/material';

export default function Inventory() {
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
			<Typography
				variant="h4"
				fontWeight={700}
				color="text.primary"
				sx={{ fontFamily: 'Public Sans' }}
			>
				清冊
			</Typography>

			{/* Content Area */}
			<Box
				sx={{
					width: '100%',
					minHeight: '400px',
					bgcolor: 'background.paper',
					borderRadius: 2,
					p: 3,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				<Typography variant="body1" color="text.secondary">
					清冊功能開發中...
				</Typography>
			</Box>
		</Box>
	);
}
