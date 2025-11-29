import { Box, Typography, Avatar, Radio, TextField, Stack, Paper, RadioGroup, FormControlLabel } from '@mui/material';
import dayjs from 'dayjs';
import { ReservationMemberResponseDto } from '@repo/shared';

interface NoteBoxProps {
	member: ReservationMemberResponseDto;
	note: string;
	attended: boolean;
	onNoteChange: (memberId: string, note: string) => void;
	onAttendedChange: (memberId: string, attended: boolean) => void;
	disabledAttended?: boolean;
}

export default function NoteBox({ member, note, attended, onNoteChange, onAttendedChange, disabledAttended = false }: NoteBoxProps) {
	// 計算年齡
	const calculateAge = (birthday: Date | null) => {
		if (!birthday) return null;
		const age = dayjs().diff(dayjs(birthday), 'year');
		return age;
	};

	const memberInfo = member.orderMember?.member;
	const age = calculateAge(memberInfo?.birthday || null);

	return (
		<Paper
			sx={{
				p: 2.5,
				bgcolor: 'background.paper',
				borderRadius: 2,
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				gap: 2,
				mb: 2,
			}}
			elevation={1}
		>
			<Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 1.5 }}>
				{/* 頭像與姓名 */}
				<Stack direction='row' spacing={2} alignItems='center'>
					<Avatar
						src={memberInfo?.avatar || '/images/profile/default-avatar.png'}
						alt={memberInfo?.name || '未知'}
						sx={{ width: 56, height: 56 }}
					/>
					<Box>
						<Typography variant='body1' color='primary' noWrap>
							{memberInfo?.name || '未知'}
						</Typography>
						<Typography variant='body2' color='text.secondary' noWrap>
							{age !== null ? `${age}歲` : '年齡未知'}
						</Typography>
					</Box>
				</Stack>

				{/* 出席選項 */}
				<RadioGroup
					row
					value={attended ? 'attended' : 'absent'}
					onChange={(e) => onAttendedChange(member.id, e.target.value === 'attended')}
				>
					<FormControlLabel value='attended' control={<Radio size='small' disabled={disabledAttended} />} label='到' />
					<FormControlLabel value='absent' control={<Radio size='small' disabled={disabledAttended} />} label='未到' />
				</RadioGroup>

				{/* 上課情形輸入框 - 備註永遠可以編輯 */}
				<TextField
					fullWidth
					multiline
					minRows={4}
					variant='outlined'
					placeholder='輸入上課情形'
					value={note}
					onChange={(e) => onNoteChange(member.id, e.target.value)}
					sx={{ bgcolor: 'white' }}
				/>
			</Box>
		</Paper>
	);
}
