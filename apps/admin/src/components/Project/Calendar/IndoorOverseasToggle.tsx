import * as React from 'react';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup, { toggleButtonGroupClasses } from '@mui/material/ToggleButtonGroup';

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
	height: '30px',
	width: '120px',
	[`& .${toggleButtonGroupClasses.grouped}`]: {
		margin: 0,
		border: 0,
		borderRadius: '8px',
		height: '30px',
		minHeight: '30px',
		width: '56px',
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

interface IndoorOverseasToggleProps {
	viewType: 'indoor' | 'overseas';
	onViewChange: (view: 'indoor' | 'overseas') => void;
}

export default function IndoorOverseasToggle({ viewType, onViewChange }: IndoorOverseasToggleProps) {
	const handleAlignment = (event: React.MouseEvent<HTMLElement>, newView: 'indoor' | 'overseas' | null) => {
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
				width: '120px',
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
				<ToggleButton value='indoor' aria-label='indoor view'>
					室內
				</ToggleButton>
				<ToggleButton value='overseas' aria-label='overseas view'>
					海外
				</ToggleButton>
			</StyledToggleButtonGroup>
		</Paper>
	);
}
