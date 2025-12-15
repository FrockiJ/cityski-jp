import { Box, Card, Select } from '@mui/material';
import { styled } from '@mui/material/styles';

export const StyledCard = styled(Card)({
	width: '100%',
	height: '100%',
	borderRadius: 16,
});

export const StyledSelect = styled(Select)({
	backgroundColor: '#f5f5f5',
	borderRadius: 8,
	'& .MuiOutlinedInput-notchedOutline': {
		border: 'none',
	},
	'& .MuiSelect-select': {
		paddingTop: 8,
		paddingBottom: 8,
		paddingLeft: 16,
		paddingRight: 16,
	},
});

export const ChartContainer = styled(Box)({
	position: 'relative',
	height: 300,
});

export const CenterTextContainer = styled(Box)({
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	textAlign: 'center',
});

export const LegendContainer = styled(Box)({
	display: 'flex',
	justifyContent: 'center',
	gap: 24,
	flexWrap: 'wrap',
	marginTop: 16,
});

export const LegendItem = styled(Box)({
	display: 'flex',
	alignItems: 'center',
	gap: 8,
});

export const LegendDot = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'dotColor',
})<{ dotColor: string }>(({ dotColor }) => ({
	width: 12,
	height: 12,
	borderRadius: '50%',
	backgroundColor: dotColor,
}));
