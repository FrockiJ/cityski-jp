import { Box } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';

import CoreDatePicker from '@/CIBase/CoreDatePicker';
import { SizeBreakPoint } from '@/shared/types/general';

interface CoreDatePickerRangeProps {
	value: {
		startDate: Dayjs | null;
		endDate: Dayjs | null;
	};
	onChange: (value: { startDate: Dayjs | null; endDate: Dayjs | null }) => void;
	checkHasError?: (bool: boolean) => void;
	startTitle?: string;
	endTitle?: string;
	width?: string;
	size?: Exclude<SizeBreakPoint, 'large'>;
	direction?: 'row' | 'column';
}

const CoreDatePickerRange = ({
	value,
	onChange,
	startTitle,
	endTitle,
	width,
	size,
	direction = 'row',
}: CoreDatePickerRangeProps) => {
	return (
		<Box
			display='flex'
			alignItems={direction === 'column' ? 'stretch' : 'flex-end'}
			flexDirection={direction}
			gap='16px'
		>
			<Box flex={width === '100%' ? '1' : 'initial'}>
				<CoreDatePicker
					title={startTitle}
					value={value.startDate}
					onChange={(startDate) => {
						onChange({ startDate, endDate: value.endDate });
					}}
					maxDate={value.endDate ? dayjs(value.endDate).subtract(1, 'day') : undefined}
					size={size}
					width={width}
				/>
			</Box>

			<Box flex={width === '100%' ? '1' : 'initial'}>
				<CoreDatePicker
					title={endTitle}
					value={value.endDate}
					onChange={(endDate) => {
						onChange({ startDate: value.startDate, endDate });
					}}
					minDate={value.startDate ? dayjs(value.startDate).add(1, 'day') : undefined}
					size={size}
					width={width}
				/>
			</Box>
		</Box>
	);
};

export default CoreDatePickerRange;
