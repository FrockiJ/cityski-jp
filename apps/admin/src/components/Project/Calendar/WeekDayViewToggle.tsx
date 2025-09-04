import * as React from 'react';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup, { toggleButtonGroupClasses } from '@mui/material/ToggleButtonGroup';

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
	height: '30px',
	width: '88px',
	[`& .${toggleButtonGroupClasses.grouped}`]: {
		margin: 0,
		border: 0,
		borderRadius: '8px',
		height: '30px',
		minHeight: '30px',
		width: '44px',
		color: '#3360FF',
		fontWeight: 700,
		'&.Mui-selected': {
			backgroundColor: '#3360FF',
			color: '#FFF',
			'&:hover': {
				backgroundColor: '#3360FF',
			},
		},
		[`&.${toggleButtonGroupClasses.disabled}`]: {
			border: 0,
		},
	},
	[`& .${toggleButtonGroupClasses.middleButton},& .${toggleButtonGroupClasses.lastButton}`]: {
		marginLeft: 0,
		borderLeft: '1px solid transparent',
	},
}));

interface WeekDayViewToggleProps {
	viewType: 'week' | 'day';
	onViewChange: (view: 'week' | 'day') => void;
}

export default function WeekDayViewToggle({ viewType, onViewChange }: WeekDayViewToggleProps) {
	const handleAlignment = (event: React.MouseEvent<HTMLElement>, newView: 'week' | 'day' | null) => {
		if (newView !== null) {
			onViewChange(newView);
		}
	};

	return (
		<Paper
			elevation={0}
			sx={{
				display: 'flex',
				border: '1px solid',
				borderColor: 'divider',
				borderRadius: '10px',
				height: '38px',
				width: '96px',
				padding: '3px',
				overflow: 'hidden',
			}}
		>
			<StyledToggleButtonGroup
				size='small'
				value={viewType}
				exclusive
				onChange={handleAlignment}
				aria-label='view toggle'
			>
				<ToggleButton value='week' aria-label='week view'>
					週
				</ToggleButton>
				<ToggleButton value='day' aria-label='day view'>
					日
				</ToggleButton>
			</StyledToggleButtonGroup>
		</Paper>
	);
}
