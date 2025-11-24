import { Box, Typography, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';
import dayjs from 'dayjs';
import { Dayjs } from 'dayjs';
import GroupsIcon from '@mui/icons-material/Groups';

import { CourseType } from '@/shared/core/constants/enum';

const EventWrapper = styled(Box)(({ theme }) => ({
	position: 'absolute',
	left: theme.spacing(0.5),
	right: theme.spacing(0.5),
	borderRadius: theme.shape.borderRadius,
	padding: theme.spacing(0.5, 1),
	fontSize: '0.75rem',
	overflow: 'visible',
	cursor: 'pointer',
	'&:hover': {
		opacity: 0.9,
		zIndex: 10,
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
	instructor?: string;
	status?: 'available' | 'full' | 'closed';
	currentBookedCount?: number;
	maxCapacity?: number;
	isMixed?: boolean;
	onClick?: () => void;
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
	instructor,
	status = 'available',
	currentBookedCount = 0,
	maxCapacity = 0,
	isMixed = false,
	onClick,
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

	const getStatusStyles = () => {
		switch (status) {
			case 'full':
				// 紅色：額滿
				return {
					backgroundColor: 'rgba(229, 57, 53, 0.24)',
					color: '#C62828',
					border: '1px solid rgba(229, 57, 53, 0.32)',
				};
			case 'closed':
				// 灰色：已關閉/過去時間
				return {
					backgroundColor: 'rgba(145, 158, 171, 0.24)',
					color: '#919EAB',
					border: '1px solid rgba(145, 158, 171, 0.32)',
				};
			case 'available':
			default:
				// 綠色：可預約
				return {
					backgroundColor: 'rgba(76, 175, 80, 0.24)',
					color: '#2E7D32',
					border: '1px solid rgba(76, 175, 80, 0.32)',
				};
		}
	};

	const getCourseTypeStyles = () => {
		if (unPaidDownPayment || status !== 'available') {
			return getStatusStyles();
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

	const styles = getCourseTypeStyles();

	return (
		<EventWrapper
			onClick={onClick}
			sx={{
				top: `${topPosition + 3}px`,
				height: `${heightPixels - 4}px`,
				backgroundColor: styles.backgroundColor,
				color: styles.color,
				width,
				left: type === 'W' ? `${leftOffset}%` : `${leftOffset + 0.16}%`,
				border: 'border' in styles ? styles.border : '1px solid currentColor',
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'space-between',
				padding: '0.25rem 0.5rem',
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
						margin: '2px',
					}}
				/>
			)}

			{/* 時間 */}
			<Typography sx={{ fontWeight: 600, fontSize: '0.65rem', lineHeight: '1.2', color: styles.color }}>
				{dayjs(`2000-01-01 ${startTime}`).format('hA')}
			</Typography>

			{/* 課程名稱 */}
			<Typography sx={{ fontWeight: 600, fontSize: '0.7rem', lineHeight: '1.2', color: styles.color, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
				{title}
			</Typography>

			{/* 教練 和 人數/上限 */}
			<Box sx={{ display: 'flex', alignItems: 'center', gap: '2px', minHeight: 0 }}>
				<Typography sx={{ fontSize: '0.6rem', lineHeight: '1.2', color: styles.color, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', flex: 1 }}>
					{instructor || '未指定'}
				</Typography>
				<Typography sx={{ fontWeight: 600, fontSize: '0.6rem', lineHeight: '1.2', color: styles.color, flexShrink: 0, whiteSpace: 'nowrap' }}>
					{currentBookedCount}/{maxCapacity}
				</Typography>
			</Box>

			{/* 併班提示 */}
			{isMixed && courseType === CourseType.GROUP && (
				<Tooltip title='已併班' placement='top' arrow>
					<GroupsIcon sx={{ fontSize: '0.75rem', color: styles.color }} />
				</Tooltip>
			)}
		</EventWrapper>
	);
};
