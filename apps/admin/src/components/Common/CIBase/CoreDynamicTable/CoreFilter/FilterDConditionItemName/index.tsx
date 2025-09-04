import CancelIcon from '@mui/icons-material/Cancel';
import { IconButton, IconButtonProps } from '@mui/material';

import { StyledFilterConditionItemName } from '../styles';

interface FilterConditionItemNameProps extends IconButtonProps {
	label: string;
}
export const FilterConditionItemName = ({ label, ...restProps }: FilterConditionItemNameProps) => {
	return (
		<StyledFilterConditionItemName>
			{label}
			<IconButton sx={{ padding: '0 8px' }} {...restProps}>
				<CancelIcon sx={{ fontSize: 14, color: 'grey.400' }} />
			</IconButton>
		</StyledFilterConditionItemName>
	);
};
