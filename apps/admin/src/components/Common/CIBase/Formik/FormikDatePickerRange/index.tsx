import { Box } from '@mui/material';
import dayjs from 'dayjs';
import { useField } from 'formik';

import CoreDatePicker from '@/CIBase/CoreDatePicker';
import { SizeBreakPoint } from '@/shared/types/general';

import { StyledFormHelperText } from './styles';

interface FormikDatePickerRangeProps {
	startName: string;
	endName: string;
	startTitle?: string;
	endTitle?: string;
	width?: string;
	size?: Exclude<SizeBreakPoint, 'large'>;
}

const FormikDatePickerRange = ({
	startName,
	endName,
	startTitle,
	endTitle,
	width = '240px',
	size,
}: FormikDatePickerRangeProps) => {
	const [startField, startMeta, startHelpers] = useField(startName);
	const [endField, endMeta, endHelpers] = useField(endName);

	const startError = !!startMeta.error && !!startMeta.touched;
	const endError = !!endMeta.error && !!endMeta.touched;

	return (
		<Box display='flex' alignItems='flex-start' gap='16px'>
			<Box flex={width === '100%' ? '1' : 'initial'}>
				<CoreDatePicker
					{...startField}
					title={startTitle}
					value={startField.value}
					onChange={(startDate) => {
						startHelpers.setTouched(true);
						startHelpers.setValue(startDate);
						// if (startDate) startHelpers.setTouched(false);
					}}
					maxDate={endField.value && dayjs(endField.value).subtract(1, 'day')}
					isError={startError}
					size={size}
				/>
				{startError && (
					<StyledFormHelperText width={width} startError={startError}>
						{startMeta.error}
					</StyledFormHelperText>
				)}
			</Box>
			<Box flex={width === '100%' ? '1' : 'initial'}>
				<CoreDatePicker
					{...endField}
					title={endTitle}
					value={endField.value}
					onChange={(endDate) => {
						endHelpers.setTouched(true);
						endHelpers.setValue(endDate);
					}}
					minDate={startField.value && dayjs(startField.value).add(1, 'day')}
					isError={endError}
					size={size}
				/>
				{endError && (
					<StyledFormHelperText width={width} startError={startError}>
						{endMeta.error}
					</StyledFormHelperText>
				)}
			</Box>
		</Box>
	);
};

export default FormikDatePickerRange;
