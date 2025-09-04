import React, { ChangeEvent, ReactNode, useEffect } from 'react';
import { CheckboxProps } from '@mui/material';
import { useField, useFormikContext } from 'formik';

import CoreCheckboxGroup from '@/CIBase/CoreCheckboxGroup';

import { StyledFormControl } from './styles';

export interface FormikCheckboxProps {
	name: string;
	label?: string | ReactNode;
	fullLabel?: boolean;
	labelClassName?: unknown;
	disabled?: boolean;
	options: Array<{
		value: string | number;
		label: string;
		disabled?: boolean;
	}>;
	[key: string]: unknown;
	formControlClasses?: {
		[key: string]: unknown;
	};
	style?: React.CSSProperties;
	onChange?: (event: React.ChangeEvent<HTMLInputElement>, value?: boolean) => void;
	placement?: 'start' | 'end' | 'top' | 'bottom';
	custom?: boolean;
	color?: CheckboxProps['color'];
	direction?: 'row' | 'column';
	width?: string;
	margin?: string;
}

const FormikCheckbox = ({
	label,
	fullLabel = true,
	options,
	disabled,
	onChange,
	placement,
	custom = false,
	color,
	direction = 'row',
	width,
	margin,
	...restProps
}: FormikCheckboxProps) => {
	const [field, meta] = useField(restProps);
	const formikContext = useFormikContext();

	useEffect(() => {
		formikContext.setTouched({ ...formikContext.touched, roles: false });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [field.value]);

	const localOnchange = (event: ChangeEvent<HTMLInputElement>, value: boolean) => {
		onChange ? onChange(event, value) : field.onChange(event);
		// field.onChange(event);
	};

	return (
		<StyledFormControl width={width} margin={margin} sx={restProps.style}>
			<CoreCheckboxGroup
				options={options}
				label={label || ''}
				fullLabel={fullLabel}
				disabled={disabled}
				{...field}
				meta={meta}
				onChange={localOnchange}
				placement={placement}
				custom={custom}
				color={color}
				direction={direction}
			/>
		</StyledFormControl>
	);
};

export default FormikCheckbox;
