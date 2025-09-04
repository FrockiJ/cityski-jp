import { useId } from 'react';
import ReactSelect, { ActionMeta, MultiValue, SingleValue } from 'react-select';
import { Box, FormControl, SxProps, useTheme } from '@mui/material';
import { SelectOption } from '@repo/shared';
import { useField } from 'formik';

import { useUpdateEffect } from '@/hooks/useUpdateEffect';
import { SizeBreakPoint } from '@/shared/types/general';

import { FormikErrorMessage } from '../common/FormikComponents';

import CustomOption from './CustomOption';
import CustomValueContainer from './CustomValueContainer';
import { customStyles, SelectLabel } from './styles';

interface FormikSelectProps {
	title?: string;
	label?: string;
	isRequired?: boolean;
	size?: Exclude<SizeBreakPoint, 'large'>;
	placeholder?: string;
	isMulti?: boolean;
	isMultiText?: boolean;
	width?: number | string;
	margin?: string;
	optionValue?: string | number | any[];
	defaultValue?: SelectOption | SelectOption[];
	onChange?: (option: MultiValue<SelectOption> | SingleValue<SelectOption>, action: ActionMeta<SelectOption>) => void;
	options: SelectOption[];
	name: string;
	onBlur?: any;
	disabled?: boolean;
	menuPlacement?: 'bottom' | 'top';
	menuPortal?: boolean;
	controlValue?: string | number | null;
	maxMenuHeight?: number;
	wrapperSxProps?: SxProps;
}

const FormikSelect = ({
	title,
	label,
	isRequired,
	size = 'small',
	placeholder,
	isMulti,
	isMultiText,
	width,
	margin,
	onChange,
	// optionValue,
	// defaultValue,
	options,
	name,
	onBlur,
	disabled,
	menuPlacement = 'bottom',
	menuPortal = false,
	controlValue,
	maxMenuHeight = 300,
	wrapperSxProps,
}: FormikSelectProps) => {
	const theme = useTheme();
	const uniqueId = useId();
	const [field, meta, helpers] = useField(name);
	const error = !!meta.error && !!meta.touched;

	const getValue = (options: SelectOption[]) => {
		if (isMulti) {
			if (Array.isArray(field.value)) {
				return options.filter((option: SelectOption) => field.value.includes(option.value));
			}
			return undefined;
		}

		return options ? options.find((option: SelectOption) => option.value === field.value) || null : undefined;
	};

	useUpdateEffect(() => {
		helpers.setValue(controlValue);
	}, [controlValue]);

	return (
		<FormControl
			sx={{
				width: width ? width : '240px',
				margin: margin ? margin : '0 0 20px 0',
				...wrapperSxProps,
			}}
		>
			<Box display='flex' justifyContent='center' flexDirection='column'>
				{title && (
					<Box typography='body2' display='flex' mb='4px' alignItems='center' sx={{ color: 'text.secondary' }}>
						{isRequired && (
							<Box component='span' sx={{ color: 'error.main', marginRight: '2px' }}>
								*
							</Box>
						)}
						{title}
					</Box>
				)}
				{label && <SelectLabel>{label}</SelectLabel>}
				<ReactSelect
					isMulti={isMulti}
					className={`size-${size} ${isMultiText ? 'multi-text' : ''}`}
					instanceId={`react-select-${uniqueId}`} // this is to resolve "Warning: Prop 'id' did not match" error
					onBlur={onBlur}
					value={getValue(options)}
					// defaultValue={options.find((item) => item.value === field.value)}
					onChange={(newValue: any, actionMeta) => {
						helpers.setValue(newValue.value);
						if (onChange) onChange(newValue, actionMeta);
					}}
					placeholder={placeholder}
					isDisabled={disabled}
					styles={customStyles(theme)}
					options={options}
					{...(menuPortal &&
						typeof document !== 'undefined' && {
							menuPlacement: 'auto',
							menuPosition: 'fixed',
							menuPortalTarget: document?.body,
						})}
					maxMenuHeight={maxMenuHeight}
					menuPlacement={menuPlacement}
					aria-label={label}
					aria-invalid={error}
					// closeMenuOnSelect={!isMulti}
					openMenuOnFocus
					openMenuOnClick
					components={{
						IndicatorSeparator: () => null,
						Option: CustomOption,
						ValueContainer: CustomValueContainer,
					}}
					hideSelectedOptions={false}
					isClearable={false}
					isSearchable={false}
				/>
			</Box>
			<FormikErrorMessage name={field.name} />
		</FormControl>
	);
};

export default FormikSelect;
