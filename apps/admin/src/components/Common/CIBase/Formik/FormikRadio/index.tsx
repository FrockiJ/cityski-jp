import React, { useEffect, useState } from 'react';
import { Box, FormControl, RadioGroup, RadioProps, SxProps, Tooltip } from '@mui/material';
import { FieldConfig, useField } from 'formik';

import InfoIcon from '@/components/Common/Icon/InfoIcon';

import { FormikErrorMessage } from '../common/FormikComponents';

import { StyledFormControlLabel, StyledRadio, StyledTitle } from './styles';

export interface FormikRadioProps extends FieldConfig {
	name: string;
	classNames?: {
		radioGroup?: string;
		label?: string;
		radio?: string;
	};
	radios: Array<{
		value: string | number;
		label: string;
		description?: string;
	}>;
	onChange?: (event: React.ChangeEvent<HTMLInputElement>, value?: string) => void;
	placement?: 'start' | 'end' | 'top' | 'bottom';
	color?: RadioProps['color'];
	direction?: 'row' | 'column';
	info?: string;
	title?: string;
	width?: string;
	margin?: string;
	isRequired?: boolean;
	isCustomLabel?: boolean;
	disabled?: boolean;
	wrapperSxProps?: SxProps;
	labelSxProps?: SxProps;
}

const FormikRadio = ({
	name,
	radios,
	disabled,
	onChange,
	placement,
	color,
	direction = 'row',
	classNames = {
		radioGroup: 'formik-radio-group',
		label: 'formik-radio-label',
		radio: 'formik-radio-radio',
	},
	info,
	title,
	width,
	margin,
	isRequired,
	isCustomLabel = false,
	wrapperSxProps,
	labelSxProps,
}: FormikRadioProps) => {
	const [field, , helpers] = useField(name);
	const [value, setValue] = useState('');

	useEffect(() => {
		if (field.value) {
			setValue(field.value);

			helpers.setValue(field.value);
		}
	}, [field.value, helpers]);

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setValue((event.target as HTMLInputElement).value);

		helpers.setValue((event.target as HTMLInputElement).value);

		if (onChange) onChange(event, value);
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
			<RadioGroup
				name={name}
				row={direction === 'row'}
				value={value}
				onChange={handleChange}
				className={classNames.radioGroup}
				sx={{ gap: 3 }}
			>
				{radios.map((radio, index) => (
					<StyledFormControlLabel
						key={index}
						className={classNames.label}
						value={radio.value}
						control={<StyledRadio color={color} className={classNames.radio} />}
						label={radio.label}
						labelPlacement={placement}
						disabled={disabled}
						isCustomLabel={isCustomLabel}
						isChecked={String(radio.value) === value}
						hasDescription={Boolean(radio.description)}
						slotProps={{
							...(radio.description && {
								typography: {
									sx: {
										'&:after': {
											content: `"${radio.description}"`,
											display: 'block',
											color: 'text.disabled',
											fontSize: 12,
										},
									},
								},
							}),
						}}
						sx={{
							...labelSxProps,
						}}
					/>
				))}
			</RadioGroup>
			<FormikErrorMessage name={field.name} />
		</FormControl>
	);
};

export default FormikRadio;
