import { Box } from '@mui/material';
import { DatePicker, DatePickerProps, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Dayjs } from 'dayjs';

import CalendarIcon from '@/Icon/CalendarIcon';
import CaretIcon from '@/Icon/CaretIcon';
import ChevronIcon from '@/Icon/ChevronIcon';
import { SizeBreakPoint } from '@/shared/types/general';

import { StyledDatePickerWrapper, StyledTitle } from './styles';

interface CoreDatePickerProps extends Omit<DatePickerProps<Dayjs>, 'label'> {
	title?: string;
	isRequired?: boolean;
	width?: string;
	name?: string;
	size?: Exclude<SizeBreakPoint, 'large'>;
	placeholder?: string;
	helperText?: string;
	isError?: boolean;
	defaultValue?: Dayjs | null;
	format?: string;
}

const CoreDatePicker = ({
	title,
	size = 'small',
	width = '240px',
	disabled,
	isRequired,
	placeholder = 'YYYY/MM/DD',
	helperText,
	isError,
	name,
	defaultValue,
	format = 'YYYY/MM/DD',
	...restProps
}: CoreDatePickerProps) => {
	return (
		<StyledDatePickerWrapper width={width}>
			{title && (
				<StyledTitle>
					{isRequired && <Box sx={{ color: 'error.main', marginRight: '2px' }}>*</Box>}
					{title}
				</StyledTitle>
			)}
			<LocalizationProvider dateAdapter={AdapterDayjs}>
				<DatePicker
					className='customDatePicker'
					format={format}
					defaultValue={defaultValue}
					disabled={disabled}
					sx={(theme) => ({
						'& .MuiOutlinedInput-root.Mui-disabled': {
							backgroundColor: theme.palette.background.light,
						},
					})}
					slots={{
						openPickerIcon: CalendarIcon,
						switchViewIcon: CaretIcon,
						leftArrowIcon: () => <ChevronIcon direction='left' />,
						rightArrowIcon: () => <ChevronIcon direction='right' />,
					}}
					slotProps={{
						popper: {
							sx: {
								'.MuiPaper-elevation': {
									boxShadow: `rgba(145, 158, 171, 0.2) 0px 5px 5px -3px, rgba(145, 158, 171, 0.14) 0px 8px 10px 1px, rgba(145, 158, 171, 0.12) 0px 3px 14px 2px`,
								},
								'.MuiPaper-rounded': {
									borderRadius: '16px',
								},
							},
						},
						textField: {
							name,
							size,
							error: isError,
							placeholder,
							helperText,
						},
					}}
					{...restProps}
				/>
			</LocalizationProvider>
		</StyledDatePickerWrapper>
	);
};

export default CoreDatePicker;
