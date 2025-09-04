import React from 'react';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { DateTimePicker, DateTimePickerProps, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';

import CalendarIcon from '@/Icon/CalendarIcon';
import CaretIcon from '@/Icon/CaretIcon';
import ChevronIcon from '@/Icon/ChevronIcon';
import { SizeBreakPoint } from '@/shared/types/general';

import { StyledDatePickerWrapper, StyledTitle } from './styles';

interface CoreDateTimePickerProps extends Omit<DateTimePickerProps<Dayjs>, 'label'> {
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

const TimeGridContainer = styled('div')({
	padding: '16px',
});

const TimeGridTitle = styled('h3')({
	margin: '0 0 16px 0',
	fontSize: '16px',
	fontStyle: 'normal',
	fontWeight: 700,
	fontFamily: '"Public Sans"',
	lineHeight: '24px',
});

const TimeGrid = styled('div')({
	display: 'grid',
	gridTemplateColumns: 'repeat(4, 1fr)',
	gap: '8px',
});

const TimeButton = styled('button')<{ selected?: boolean }>(({ selected }) => ({
	padding: '8px',
	border: '1px solid #E5E7EB',
	borderRadius: '8px',
	width: '70px',
	height: '44px',
	background: selected ? '#1939B7' : 'white',
	color: selected ? 'white' : '#1F2937',
	cursor: 'pointer',
	fontSize: '14px',
	fontStyle: 'normal',
	fontWeight: 600,
	fontFamily: '"Public Sans"',
	'&:hover': {
		background: selected ? '#1939B7' : '#F3F4F6',
	},
}));

interface TimeViewProps {
	value: Dayjs | null;
	onChange: (value: Dayjs) => void;
}

const CustomTimeView = ({ value, onChange }: TimeViewProps) => {
	const generateTimeSlots = () => {
		const slots = [];
		for (let hour = 9; hour <= 20; hour++) {
			for (let minute of [0, 30]) {
				slots.push(`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`);
			}
		}
		return slots;
	};

	const timeSlots = generateTimeSlots();

	const isTimeSelected = (timeStr: string) => {
		if (!value) return false;
		const [hours, minutes] = timeStr.split(':').map(Number);
		return value.hour() === hours && value.minute() === minutes;
	};

	const handleTimeClick = (timeStr: string) => {
		const [hours, minutes] = timeStr.split(':').map(Number);
		const currentDate = value || dayjs();
		const newDate = currentDate.clone().hour(hours).minute(minutes).second(0);
		onChange(newDate);
	};

	return (
		<TimeGridContainer>
			<TimeGridTitle>選擇時段</TimeGridTitle>
			<TimeGrid>
				{timeSlots.map((timeSlot) => (
					<TimeButton key={timeSlot} selected={isTimeSelected(timeSlot)} onClick={() => handleTimeClick(timeSlot)}>
						{timeSlot}
					</TimeButton>
				))}
			</TimeGrid>
		</TimeGridContainer>
	);
};

const CoreDateTimePicker = ({
	title,
	size = 'small',
	width = '240px',
	disabled,
	isRequired,
	placeholder = 'YYYY/MM/DD HH:mm',
	helperText,
	isError,
	name,
	defaultValue,
	format = 'YYYY/MM/DD HH:mm',
	...restProps
}: CoreDateTimePickerProps) => {
	return (
		<StyledDatePickerWrapper width={width}>
			{title && (
				<StyledTitle>
					{isRequired && <Box sx={{ color: 'error.main', marginRight: '2px' }}>*</Box>}
					{title}
				</StyledTitle>
			)}
			<LocalizationProvider
				dateAdapter={AdapterDayjs}
				adapterLocale='zh-tw'
				dateLibInstance={dayjs().locale('zh-tw')}
				localeText={{
					cancelButtonLabel: '取消',
					okButtonLabel: '確認',
				}}
			>
				<DateTimePicker
					openTo='day'
					className='customDatePicker'
					format={format}
					defaultValue={defaultValue}
					disabled={disabled}
					ampm={false}
					views={['year', 'month', 'day', 'hours', 'minutes']}
					viewRenderers={{
						hours: CustomTimeView,
						minutes: CustomTimeView,
					}}
					closeOnSelect={false}
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
						actionBar: {
							actions: ['cancel', 'accept'],
							sx: {
								'& .MuiButton-root': {
									color: '#3360FF',
									fontWeight: 700,
								},
							},
						},
						field: {
							format: 'YYYY/MM/DD HH:mm',
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

export default CoreDateTimePicker;
