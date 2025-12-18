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
	overlappingEvents?: number;
	eventPosition?: number;
	date?: Dayjs;
	currentDate?: Dayjs;
	instructorName?: string;
	transactionStatus?: number | null;
	currentBookedCount?: number;
	maxCapacity?: number;
	isMixed?: boolean;
	boardType?: string;
	level?: number;
	onClick?: () => void;
}

export const Event = ({
	type,
	title,
	startTime,
	endTime,
	overlappingEvents = 1,
	eventPosition = 0,
	date,
	currentDate,
	courseType,
	instructorName = '未知',
	transactionStatus = null,
	currentBookedCount = 0,
	maxCapacity = 0,
	isMixed = false,
	boardType,
	level,
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

	const getOrderTypeStyles = (
		courseType: CourseType,
		transactionStatus: number | null,
		currentBookedCount: number,
		maxCapacity: number
	) => {
		// Priority 1: Pending Deposit overrides everything
		if (transactionStatus === 0) {
			return {
				backgroundColor: 'rgba(145, 158, 171, 0.24)',
				textColor: '#919EAB',
				borderColor: 'rgba(145, 158, 171, 0.32)',
			};
		}

		// Priority 2: Course Type
		switch (courseType) {
			case CourseType.GROUP:
				const isFull = currentBookedCount >= maxCapacity && maxCapacity > 0;
				return isFull
					? {
							backgroundColor: 'rgba(0, 184, 217, 0.24)',
							textColor: '#006C9C',
							borderColor: 'rgba(0, 184, 217, 0.32)',
					  }
					: {
							backgroundColor: '#FFFFFF',
							textColor: '#006C9C',
							borderColor: '#00B8D9',
					  };
			case CourseType.PRIVATE:
				return {
					backgroundColor: 'rgba(255, 171, 0, 0.24)',
					textColor: '#B76E00',
					borderColor: 'rgba(255, 171, 0, 0.32)',
				};
			case CourseType.INDIVIDUAL:
				return {
					backgroundColor: 'rgba(54, 179, 126, 0.24)',
					textColor: '#1B806A',
					borderColor: 'rgba(54, 179, 126, 0.32)',
				};
			default:
				return {
					backgroundColor: 'rgba(145, 158, 171, 0.24)',
					textColor: '#919EAB',
					borderColor: 'rgba(145, 158, 171, 0.32)',
				};
		}
	};

	const styles = getOrderTypeStyles(courseType, transactionStatus, currentBookedCount, maxCapacity);
	const showRedDot = transactionStatus === 2; // PENDING_FULL_PAYMENT
	const isShortDuration = durationMinutes <= 30;

	const getDisplayLabel = () => {
		if (courseType === CourseType.INDIVIDUAL) return '個人練習';
		if (courseType === CourseType.GROUP) return `${instructorName} (團體)`;
		if (courseType === CourseType.PRIVATE) return `${instructorName} (私人)`;
		return instructorName;
	};

	const getBoardTypeAndLevel = () => {
		if (!boardType && !level) return title;
		const boardTypeText = boardType || '';
		const levelText = level ? `LV.${level}` : '';
		if (boardTypeText && levelText) {
			return `${boardTypeText} ${levelText}`;
		}
		return boardTypeText || levelText || title;
	};

	return (
		<EventWrapper
			onClick={onClick}
			sx={{
				top: `${topPosition + 3}px`,
				height: `${heightPixels - 4}px`,
				backgroundColor: styles.backgroundColor,
				color: styles.textColor,
				width,
				left: type === 'W' ? `${leftOffset}%` : `${leftOffset + 0.16}%`,
				border: `1px solid ${styles.borderColor}`,
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'flex-start',
				padding: '6px',
			}}
		>
			{showRedDot && (
				<Box
					sx={{
						position: 'absolute',
						top: '4px',
						right: '4px',
						backgroundColor: '#FF5630',
						width: '5px',
						height: '5px',
						borderRadius: '50%',
					}}
				/>
			)}

			{/* 第一行：板類 + 等級 */}
			<Typography
				sx={{
					fontWeight: 700,
					fontSize: '0.75rem',
					lineHeight: '1rem',
					color: styles.textColor,
					textTransform: 'uppercase',
					overflow: 'hidden',
					textOverflow: 'ellipsis',
					whiteSpace: 'nowrap',
				}}
			>
				{getBoardTypeAndLevel()}
			</Typography>

			{/* 第二行：姓名 + 訂單類型/狀態 */}
			<Typography
				sx={{
					fontSize: '0.875rem',
					lineHeight: '1.25rem',
					color: styles.textColor,
					overflow: 'hidden',
					textOverflow: 'ellipsis',
					whiteSpace: 'nowrap',
				}}
			>
				{getDisplayLabel()}
			</Typography>
		</EventWrapper>
	);
};
