import React from 'react';
import { Box, Typography, Paper, Avatar, Stack, Chip, IconButton } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { GetReservationDetailResponseDto } from '@repo/shared';

interface MemberListProps {
	members: NonNullable<GetReservationDetailResponseDto['reservationMembers']>;
	onRemoveMember?: (memberId: string) => void;
	loading?: boolean;
}

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

	console.log('members!!!!', members);

	return (
		<Stack spacing={2}>
			{members.map((reservationMember) => {
				const { orderMember } = reservationMember;
				console.log(orderMember);
				if (!orderMember || !orderMember.member	) return null;

				// const { member, order } = orderMember;
				console.log('orderMember', orderMember);
				const member = orderMember.member;
				return (
					<Paper
						key={reservationMember.id}
						sx={{
							p: 2.5,
							display: 'flex',
							alignItems: 'center',
							gap: 2,
							borderRadius: 2,
							bgcolor: 'background.paper',
						}}
					>
						{/* 左側：頭像 + 姓名/標籤 */}
						<Stack direction='row' alignItems='center' spacing={1.5} sx={{ width: 256 }}>
							<Box sx={{ position: 'relative', width: 40, height: 40 }}>
								<Avatar
									src={member.avatar || undefined}
									alt='avatar'
									sx={{
										width: 36,
										height: 36,
										position: 'absolute',
										top: 2,
										left: 2,
										borderRadius: 99,
									}}
								/>
							</Box>

							<Stack spacing={0.5}>
								<Stack direction='row' alignItems='center' spacing={1} sx={{ flexWrap: 'wrap' }}>
									<Typography variant='body1' color='text.primary'>
										{member.name}
									</Typography>

									{/* 技能等級 Badge */}
									<Chip
										size='small'
										label={
											<Box component='span' sx={{ display: 'inline-flex', alignItems: 'baseline', gap: 0.5 }}>
												<Typography component='span' variant='caption' sx={{ lineHeight: 1.25, fontWeight: 400 }}>
													單板LV.{member.skis} 雙板LV.
													{member.snowboard}
												</Typography>
											</Box>
										}
										sx={(theme) => ({
											px: 0.75,
											height: 24,
											borderRadius: 1,
											color: theme.palette.error.main,
											'& .MuiChip-label': { px: 0.5, py: 0.25 },
										})}
										variant='filled'
									/>
								</Stack>

								<Typography variant='caption' color='text.secondary'>
									{member.phone || '無電話'}
								</Typography>
							</Stack>
						</Stack>

						{/* 訂單編號 */}
						<Stack spacing={1} sx={{ minWidth: 100 }}>
							<Typography variant='caption' color='text.secondary'>
								訂單編號
							</Typography>
							<Typography variant='body2' color='text.primary'>
								{orderMember.order.no}
							</Typography>
						</Stack>

						{/* 刪除按鈕 */}
						{onRemoveMember && (
							<IconButton onClick={() => onRemoveMember(reservationMember.id)} color='error' sx={{ ml: 'auto' }}>
								<DeleteOutlineIcon />
							</IconButton>
						)}
					</Paper>
				);
			})}
		</Stack>
	);
};

export default MemberList;
