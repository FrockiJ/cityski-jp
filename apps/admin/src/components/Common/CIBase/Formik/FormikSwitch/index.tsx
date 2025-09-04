import React from 'react';
import {
	Box,
	FormControl,
	FormControlLabel,
	FormControlLabelProps,
	SwitchProps,
	SxProps,
	Tooltip,
} from '@mui/material';
import { useField } from 'formik';

import InfoIcon from '@/components/Common/Icon/InfoIcon';
import { SizeBreakPoint } from '@/shared/types/general';

import { FormikErrorMessage } from '../common/FormikComponents';

import { StyledSwitch, StyledTitle } from './styles';

export interface FormikSwitchProps extends SwitchProps {
	name: string;
	label?: string | React.ReactNode;
	labelPlacement?: FormControlLabelProps['labelPlacement'];
	size?: Exclude<SizeBreakPoint, 'large'>;
	isRequired?: boolean;
	checked: boolean;
	info?: string;
	title?: string;
	width?: number | string;
	margin?: string;
	wrapperSxProps?: SxProps;
}

const FormikSwitch = ({
	name,
	label,
	labelPlacement,
	size = 'medium',
	color,
	isRequired,
	info,
	title,
	width,
	margin,
	wrapperSxProps,
	disabled,
	onChange,
	checked,
}: FormikSwitchProps) => {
	const [field] = useField(name);

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
		if (onChange) onChange(event, checked);
	};

	return (
		<FormControl
			sx={{
				width: width ? width : 'initial',
				margin: margin ? margin : '0 0 20px 0',
				...wrapperSxProps,
			}}
		>
			{title && (
				<StyledTitle>
					{isRequired && <Box sx={{ color: 'error.main', marginRight: '2px' }}>*</Box>}
					{title}
					{info && (
						<Tooltip title={info}>
							<span style={{ display: 'inherit' }}>
								<InfoIcon color='info' sx={{ ml: 1 }} />
							</span>
						</Tooltip>
					)}
				</StyledTitle>
			)}
			<FormControlLabel
				name={name}
				control={<StyledSwitch color={color} checked={checked} onChange={handleChange} size={size} />}
				label={label}
				sx={{
					margin: 0,
					'.MuiFormControlLabel-label': {
						typography: 'body2',
						paddingLeft: '9px',
					},
				}}
				labelPlacement={labelPlacement}
				disabled={disabled}
			/>
			<FormikErrorMessage name={field.name} />
		</FormControl>
	);
};

export default FormikSwitch;
