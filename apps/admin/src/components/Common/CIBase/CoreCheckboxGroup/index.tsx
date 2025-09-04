import { ChangeEvent, ReactNode } from 'react';
import { Box, Checkbox as MuiCheckbox, CheckboxProps, FormControlLabel } from '@mui/material';
import { FieldMetaProps } from 'formik';

import CheckboxIndeterminateIcon from '@/Icon/CheckboxIndeterminateIcon';
import CheckboxOffIcon from '@/Icon/CheckboxOffIcon';
import CheckboxOnIcon from '@/Icon/CheckboxOnIcon';

import { StyledFormGroup, StyledFormHelperText, StyledFormLabel, typographyStyle } from './styles';

interface CoreCheckboxGroupProps {
	value: (string | number)[];
	onChange: (event: ChangeEvent<HTMLInputElement>, checked: boolean) => void;
	classNames?: {
		label?: string;
		CheckboxGroup?: string;
		checkbox?: string;
	};
	withWarning?: boolean;
	label?: string | ReactNode;
	options: Array<{
		value: string | number;
		label: string;
		disabled?: boolean;
	}>;
	meta?: FieldMetaProps<unknown>;
	color?: CheckboxProps['color'];
	placement?: 'start' | 'end' | 'top' | 'bottom';
	direction?: 'row' | 'column';
	[key: string]: unknown;
}

export const CoreCheckbox = ({ disabled, ...props }: CheckboxProps) => {
	return (
		<MuiCheckbox
			checkedIcon={<CheckboxOnIcon sx={{ ...(disabled && { color: 'text.disabled' }) }} />}
			indeterminateIcon={<CheckboxIndeterminateIcon sx={{ ...(disabled && { color: 'text.disabled' }) }} />}
			icon={<CheckboxOffIcon />}
			// disableRipple
			sx={
				{
					// padding: '0px',
				}
			}
			disabled={disabled}
			{...props}
		/>
	);
};

const CoreCheckboxGroup = ({
	withWarning = true,
	label,
	value,
	onChange,
	classNames,
	options,
	meta,
	placement,
	color,
	direction = 'row',
	...restParam
}: CoreCheckboxGroupProps) => {
	return (
		<StyledFormGroup>
			{label && (
				<StyledFormLabel focused={false}>
					{label}{' '}
					{withWarning && meta?.touched && meta?.error && <StyledFormHelperText>{meta.error}</StyledFormHelperText>}
				</StyledFormLabel>
			)}
			<Box
				sx={{
					display: 'flex',
					flexDirection: direction === 'row' ? 'row' : 'column',
				}}
			>
				{options.map((option) => (
					<FormControlLabel
						key={option.value}
						className={classNames?.checkbox ? classNames.checkbox : ''}
						value={option.value}
						labelPlacement={placement}
						control={
							<CoreCheckbox
								name={(restParam.name as string) || 'localCheckbox'}
								checked={value?.includes?.(option.value)}
								onChange={onChange}
								color={color}
							/>
						}
						disabled={option.disabled || !!restParam.disabled || !!restParam.readOnly}
						label={option.label}
						componentsProps={{ typography: typographyStyle }}
					/>
				))}
			</Box>
		</StyledFormGroup>
	);
};

export default CoreCheckboxGroup;
