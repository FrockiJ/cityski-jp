import React from 'react';
import {
	Box,
	Typography,
	Avatar,
	Stack,
	Chip,
	Button,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
} from '@mui/material';
import { GetReservationDetailResponseDto, CourseSkiType, ReservationStatus } from '@repo/shared';

interface MemberListProps {
	members: NonNullable<GetReservationDetailResponseDto['reservationMembers']>;
	onRemoveMember?: (memberId: string) => void;
	loading?: boolean;
}

// Calculate age from birthday
const calculateAge = (birthday: Date | null | undefined): string => {
	if (!birthday) return '未知';
	const today = new Date();
	const birthDate = new Date(birthday);
	let age = today.getFullYear() - birthDate.getFullYear();
	const monthDiff = today.getMonth() - birthDate.getMonth();
	if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
		age--;
	}
	return age.toString();
};

// Format ski type chips based on order.skiType
const formatSkiTypeChips = (
	skiType: CourseSkiType,
	skis: number,
	snowboard: number
): Array<{ label: string; key: string }> => {
	const chips = [];

	// CourseSkiType: BOTH=0, SNOWBOARD=1, SKI=2
	if (skiType === 2 || skiType === 0) {
		// SKI or BOTH
		chips.push({
			label: `雙板 LV.${skis}`,
			key: 'ski',
		});
	}

	if (skiType === 1 || skiType === 0) {
		// SNOWBOARD or BOTH
		chips.push({
			label: `單板 LV.${snowboard}`,
			key: 'snowboard',
		});
	}

	return chips;
};

// Calculate used sessions (count reservations where this member participated)
const calculateUsedSessions = (
	orderReservations: any[],
	planNumber: number,
	orderMemberId: string
): string => {
	const usedCount = orderReservations.filter(
		(or) =>
			or.reservation &&
			or.reservation.reservationStatus !== ReservationStatus.CANCELED &&
			or.reservation.reservationMembers?.some((rm: any) => rm.orderMemberId === orderMemberId)
	).length;

	return `${usedCount}/${planNumber}`;
};

const MemberList: React.FC<MemberListProps> = ({ members, onRemoveMember, loading }) => {
	if (loading) {
		return (
			<Box py={2}>
				<Typography variant='body2' color='text.secondary' textAlign='center'>
					載入中...
				</Typography>
			</Box>
		);
	}

	if (members.length === 0) {
		return (
			<Box py={2}>
				<Typography variant='body2' color='text.secondary' textAlign='center'>
					目前無參加人員
				</Typography>
			</Box>
		);
	}

	return (
		<TableContainer>
			<Table sx={{ minWidth: 640 }}>
				{/* Table Header */}
				<TableHead>
					<TableRow sx={{ bgcolor: 'grey.200' }}>
						<TableCell sx={{ width: 90, fontWeight: 600 }}>會員</TableCell>
						<TableCell sx={{ width: 192, fontWeight: 600 }}>聯絡方式</TableCell>
						<TableCell sx={{ width: 96, fontWeight: 600 }}>訂單編號</TableCell>
						<TableCell sx={{ width: 80, fontWeight: 600 }}>前一堂課</TableCell>
						<TableCell sx={{ width: 'auto', fontWeight: 600 }}>使用堂數</TableCell>
						<TableCell sx={{ width: 80, fontWeight: 600 }}>操作</TableCell>
					</TableRow>
				</TableHead>

				{/* Table Body */}
				<TableBody>
					{members.map((reservationMember) => {
						const { orderMember } = reservationMember;
						if (!orderMember?.member || !orderMember?.order) return null;

						const { member, order } = orderMember;
						const age = calculateAge(member.birthday);
						const skiChips = formatSkiTypeChips(order.skiType, member.skis, member.snowboard);
						const usedSessions = calculateUsedSessions(
							order.orderReservations || [],
							order.planNumber,
							orderMember.id
						);

						return (
							<TableRow
								key={reservationMember.id}
								sx={{
									'&:not(:last-child)': {
										borderBottom: '1px solid',
										borderColor: 'divider',
									},
								}}
							>
								{/* Column 1: Member (Avatar + Name + Age) */}
								<TableCell>
									<Stack direction='row' spacing={1.5} alignItems='center'>
										<Box sx={{ width: 40, height: 40, position: 'relative' }}>
											<Avatar
												src={member.avatar || undefined}
												alt={member.name}
												sx={{
													width: 36,
													height: 36,
													position: 'absolute',
													top: 2,
													left: 2,
												}}
											/>
										</Box>
										<Stack spacing={0.25}>
											<Typography
												variant='body2'
												sx={{
													color: 'primary.main',
													cursor: 'pointer',
													'&:hover': { textDecoration: 'underline' },
												}}
											>
												{member.name}
											</Typography>
											<Typography variant='caption' color='text.secondary'>
												{age}歲
											</Typography>
										</Stack>
									</Stack>
								</TableCell>

								{/* Column 2: Contact (Phone + Email) */}
								<TableCell>
									<Stack spacing={0.25}>
										<Typography variant='body2' color='text.primary'>
											{member.phone || '-'}
										</Typography>
										<Typography variant='caption' color='text.secondary'>
											{member.email || '-'}
										</Typography>
									</Stack>
								</TableCell>

								{/* Column 3: Order Number */}
								<TableCell>
									<Typography
										variant='body2'
										sx={{
											color: 'primary.main',
											cursor: 'pointer',
											'&:hover': { textDecoration: 'underline' },
										}}
									>
										{order.no}
									</Typography>
								</TableCell>

								{/* Column 4: Previous Class (Ski Type Chips) */}
								<TableCell>
									<Stack spacing={0.5}>
										{skiChips.map((chip) => (
											<Chip
												key={chip.key}
												label={chip.label}
												size='small'
												sx={{
													height: 24,
													fontSize: '0.75rem',
													bgcolor: 'info.lighter',
													color: 'info.dark',
												}}
											/>
										))}
									</Stack>
								</TableCell>

								{/* Column 5: Used Sessions */}
								<TableCell>
									<Typography variant='body2' color='text.primary'>
										{usedSessions}
									</Typography>
								</TableCell>

								{/* Column 6: Action (Remove Button) */}
								<TableCell>
									{onRemoveMember && (
										<Button
											variant='text'
											color='error'
											size='small'
											onClick={() => onRemoveMember(reservationMember.id)}
											sx={{ minWidth: 'auto', px: 1 }}
										>
											移除
										</Button>
									)}
								</TableCell>
							</TableRow>
						);
					})}
				</TableBody>
			</Table>
		</TableContainer>
	);
};

export default MemberList;
