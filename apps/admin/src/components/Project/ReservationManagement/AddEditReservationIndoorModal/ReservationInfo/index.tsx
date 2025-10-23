import React from 'react';
import { Stack, Typography } from '@mui/material';
import { CourseType, GetReservationDetailResponseDto } from '@repo/shared';

import BlockArea from '@/components/Project/shared/BlockArea';

interface CourseInfo {
	no: string;
	type: string;
	teachingType: string;
	status: string;
}

type Props = {
	courseInfo?: CourseInfo;
	reservationDetail?: GetReservationDetailResponseDto | null;
	courseType?: CourseType;
};

const ReservationInfo = ({ courseInfo, reservationDetail, courseType }: Props) => {
	// 根據預約狀態顯示中文狀態
	const getReservationStatusText = (status?: number) => {
		if (!status) return '--';
		switch (status) {
			case 1: // SCHEDULED
				return '已排定';
			case 2: // COMPLETED
				return '已完成';
			case 9: // CANCELLED
				return '已取消';
			default:
				return '未知狀態';
		}
	};

	return (
		<BlockArea>
			<Stack gap={3} width='100%'>
				<Stack direction='row' gap={3}>
					<Stack gap={0.5} width='33%'>
						<Typography variant='body2' color='text.secondary'>
							預約編號
						</Typography>
						<Typography variant='body1'>
							{reservationDetail?.reservationNo || courseInfo?.no || '--'}
						</Typography>
					</Stack>
					<Stack gap={0.5} width='33%'>
						<Typography variant='body2' color='text.secondary'>
							課程狀態
						</Typography>
						<Typography variant='body1'>
							{getReservationStatusText(reservationDetail?.reservationStatus) || courseInfo?.status || '--'}
						</Typography>
					</Stack>
					<Stack gap={0.5} width='33%'>
						<Typography variant='body2' color='text.secondary'>
							剩餘名額
						</Typography>
					</Stack>
				</Stack>
				<Stack direction='row' gap={3}>
					<Stack gap={0.5} width='31%'>
						<Typography variant='body2' color='text.secondary'>
							人數限制
						</Typography>
					</Stack>
					<Stack gap={0.5} width='31%'>
						<Typography variant='body2' color='text.secondary'>
							課程類型
						</Typography>
						<Typography variant='body1'>預約團體｜雙板</Typography>
					</Stack>
				</Stack>
			</Stack>
		</BlockArea>
	);
};

export default ReservationInfo;
