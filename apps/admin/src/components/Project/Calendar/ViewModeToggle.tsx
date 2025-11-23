import React from 'react';
import { CalendarMonth, List } from '@mui/icons-material';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';

type ViewMode = 'calendar' | 'list';

interface ViewModeToggleProps {
	viewMode: ViewMode;
	onViewModeChange: (mode: ViewMode) => void;
}

const ViewModeToggle: React.FC<ViewModeToggleProps> = ({ viewMode, onViewModeChange }) => {
	return (
		<ToggleButtonGroup
			value={viewMode}
			exclusive
			onChange={(_, newMode) => {
				if (newMode !== null) {
					onViewModeChange(newMode);
				}
			}}
			size='small'
			sx={{
				'& .MuiToggleButton-root': {
					border: 1,
					borderColor: 'rgba(145, 158, 171, 0.32)',
					color: '#637381',
					'&.Mui-selected': {
						backgroundColor: 'rgba(0, 184, 217, 0.08)',
						color: '#006C9C',
						borderColor: '#00B8D9',
						'&:hover': {
							backgroundColor: 'rgba(0, 184, 217, 0.16)',
						},
					},
					'&:hover': {
						backgroundColor: 'rgba(145, 158, 171, 0.08)',
					},
				},
			}}
		>
			<ToggleButton value='calendar' aria-label='行事曆檢視'>
				<CalendarMonth sx={{ mr: 0.5 }} />
				行事曆
			</ToggleButton>
			<ToggleButton value='list' aria-label='列表檢視'>
				<List sx={{ mr: 0.5 }} />
				列表
			</ToggleButton>
		</ToggleButtonGroup>
	);
};

export default ViewModeToggle;
