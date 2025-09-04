import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Box } from '@mui/material';
import { ButtonProps as MuiButtonProps } from '@mui/material';
import { BtnActionTypeEnum } from '@repo/shared';
import { DotPulse } from '@uiball/loaders';

import AddIcon from '@/Icon/AddIcon';
import FilterIcon from '@/Icon/FilterIcon';
import TrashIcon from '@/Icon/TrashIcon';
import { PermissionsProps } from '@/shared/types/auth';

import { StyledButton } from './styles';

export interface CoreButtonProps extends Omit<MuiButtonProps, 'children'>, PermissionsProps {
	iconType?: BtnActionTypeEnum;
	iconPlacement?: 'start' | 'end';
	type?: 'submit' | 'reset' | 'button';
	width?: string | number;
	margin?: string;
	label?: string;
	isSubmitting?: boolean;
	customIcon?: React.ReactNode;
	buttonIsLink?: boolean;
}

const CoreButton = ({
	type = 'button',
	size = 'medium',
	margin = '0 0',
	iconPlacement = 'start',
	label,
	isSubmitting,
	disabled = isSubmitting,
	variant,
	color,
	permissions,
	iconType,
	customIcon,
	...restProps
}: CoreButtonProps) => {
	return (
		<StyledButton
			iconType={iconType}
			color={color}
			size={size}
			margin={margin}
			variant={variant}
			type={type}
			disabled={disabled || (permissions && !permissions.edit)}
			{...(iconType && {
				[iconType === 'link' ? 'endIcon' : iconPlacement === 'start' ? 'startIcon' : 'endIcon']: {
					basic: null,
					add: <AddIcon />,
					delete: <TrashIcon />,
					link: <ArrowOutwardIcon />,
					manage: null,
					warning: null,
					outline: null,
					tableFilter: <FilterIcon />,
					filterClear: <RefreshIcon />,
				}[iconType],
			})}
			{...(customIcon && {
				[iconPlacement === 'start' ? 'startIcon' : 'endIcon']: customIcon,
			})}
			{...restProps}
		>
			{isSubmitting ? <DotPulse size={20} speed={0.8} color='grey' /> : <Box height='100%'>{label}</Box>}
		</StyledButton>
	);
};

export default CoreButton;
