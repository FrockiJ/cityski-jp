import { FormControl, SxProps } from '@mui/material';
import dayjs from 'dayjs';
import { useField } from 'formik';

import CoreDatePicker from '@/CIBase/CoreDatePicker';
import { SizeBreakPoint } from '@/shared/types/general';

interface FormikDatePickerProps {
	name: string;
	title?: string;
	placeholder?: string;
	helperText?: string;
	isRequired?: boolean;
	width?: string;
	disabled?: boolean;
	disablePast?: boolean;
	size?: Exclude<SizeBreakPoint, 'large'>;
	wrapperSxProps?: SxProps;
	margin?: string;
	format?: string;
}

const FormikDatePicker = ({
	name,
	title,
	placeholder = 'YYYY/MM/DD',
	helperText,
	isRequired,
	width = '240px',
	disabled = false,
	disablePast = false,
	size,
	wrapperSxProps,
	margin,
	format,
}: FormikDatePickerProps) => {
	const [field, meta, helpers] = useField(name);
	const invalid = !!meta.error && !!meta.touched;

	return (
		<FormControl
			sx={{
				width: width ? width : '320px',
				margin: margin ? margin : 'initial',
				maxWidth: '100%',
				...wrapperSxProps,
			}}
		>
			<CoreDatePicker
				name={name}
				title={title}
				isRequired={isRequired}
				isError={invalid}
				disabled={disabled}
				disablePast={disablePast}
				placeholder={placeholder}
				helperText={invalid ? meta.error : helperText}
				size={size}
				width={width}
				format={format}
				value={field.value && dayjs(field.value)}
				onChange={(date) => {
					helpers.setTouched(true);
					helpers.setValue(date);
				}}
			/>
		</FormControl>
	);
};

export default FormikDatePicker;
