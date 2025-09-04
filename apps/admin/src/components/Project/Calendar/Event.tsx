import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import dayjs from 'dayjs';
import { Dayjs } from 'dayjs';

import { CourseType } from '@/shared/core/constants/enum';

const EventWrapper = styled(Box)(({ theme }) => ({
	position: 'absolute',
	left: theme.spacing(0.5),
	right: theme.spacing(0.5),
	borderRadius: theme.shape.borderRadius,
	padding: theme.spacing(0.5, 1),
	fontSize: '0.75rem',
	overflow: 'hidden',
	cursor: 'pointer',
	'&:hover': {
		opacity: 0.9,
	},
}));

interface EventProps {
	type?: 'D' | 'W';
	courseType: CourseType;
	title: string;
	startTime: string;
	endTime: string;
	backgroundColor?: string;
	color?: string;
	overlappingEvents?: number;
	eventPosition?: number;
	date?: Dayjs;
	currentDate?: Dayjs;
	unPaidDownPayment?: boolean;
	paymentSettled?: boolean;
}

export const Event = ({
	type,
	title,
	startTime,
	endTime,
	backgroundColor = 'primary.light',
	color = 'primary.dark',
	overlappingEvents = 1,
	eventPosition = 0,
	date,
	currentDate,
	unPaidDownPayment = false,
	courseType,
	paymentSettled = true,
}: EventProps) => {
	if (date && currentDate) {
		const eventDate = date.startOf('day');
		const columnDate = currentDate.startOf('day');
		const isSameDay = eventDate.isSame(columnDate, 'day');
		if (!isSameDay) {
			return null;
		}
	}

	const baseDate = dayjs().format('YYYY-MM-DD');
	const start = dayjs(`${baseDate} ${startTime}`);
	const end = dayjs(`${baseDate} ${endTime}`);
	const calendarStart = dayjs(`${baseDate} 10:00`);

	const minutesFromStart = start.diff(calendarStart, 'minute');
	const durationMinutes = end.diff(start, 'minute');

	const topPosition = (minutesFromStart * 56) / 60;
	const heightPixels = (durationMinutes * 56) / 60;

	const width = `calc((100% - 4px) / ${overlappingEvents})`;
	const leftOffset =
		type === 'W' ? 1 + eventPosition * (100 / overlappingEvents) : eventPosition * (100 / overlappingEvents);

	const getCourseTypeStyles = () => {
		if (unPaidDownPayment) {
			return {
				backgroundColor: 'rgba(145, 158, 171, 0.24)',
				color: '#919EAB',
				border: '1px solid rgba(145, 158, 171, 0.32)',
			};
		}

		switch (courseType) {
			case CourseType.GROUP:
				return {
					backgroundColor: 'rgba(0, 184, 217, 0.24)',
					color: '#006C9C',
					border: '1px solid rgba(0, 184, 217, 0.32)',
				};
			case CourseType.PRIVATE:
				return {
					backgroundColor: 'rgba(255, 171, 0, 0.24)',
					color: '#B76E00',
					border: '1px solid rgba(255, 171, 0, 0.32)',
				};
			case CourseType.TRAINING:
				return {
					backgroundColor: 'rgba(54, 179, 126, 0.24)',
					color: '#1B806A',
					border: '1px solid rgba(54, 179, 126, 0.32)',
				};
			default:
				return {
					backgroundColor,
					color,
				};
		}
	};

	return (
		<EventWrapper
			sx={{
				top: `${topPosition + 3}px`,
				height: `${heightPixels - 4}px`,
				backgroundColor: getCourseTypeStyles().backgroundColor,
				color: getCourseTypeStyles().color,
				width,
				left: type === 'W' ? `${leftOffset}%` : `${leftOffset + 0.16}%`,
				...(unPaidDownPayment && {
					border: getCourseTypeStyles().border,
				}),
				border: getCourseTypeStyles().border,
			}}
		>
			{!paymentSettled && (
				<Box
					sx={{
						position: 'absolute',
						top: 0,
						right: 0,
						backgroundColor: 'red',
						width: '5px',
						height: '5px',
						borderRadius: '50%',
						margin: '4px',
					}}
				/>
			)}
			<Typography variant='subtitle2' sx={{ fontWeight: 600, fontSize: '0.75rem' }}>
				<span style={{ color: getCourseTypeStyles().color }}>{title}</span>
			</Typography>
			<Typography variant='caption'>
				<span style={{ color: getCourseTypeStyles().color }}>王綺文 (團體)</span>
			</Typography>
		</EventWrapper>
	);
};
