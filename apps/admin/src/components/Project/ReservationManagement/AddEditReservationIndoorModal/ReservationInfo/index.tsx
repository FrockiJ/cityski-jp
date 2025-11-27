import React from 'react';
import { Stack, Typography } from '@mui/material';
import {
	CourseType,
	GetReservationDetailResponseDto,
	GetOrderDetailResponseDTO,
	GetCourseDetailResponseDTO,
	CourseSkiType,
	CourseBkgType,
} from '@repo/shared';

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
	orderDetail?: GetOrderDetailResponseDTO | null;
	courseDetail: GetCourseDetailResponseDTO | null;
	displayMembers?: any[];
};

const ReservationInfo = ({ courseInfo, reservationDetail, orderDetail, courseDetail, displayMembers }: Props) => {
	// 根據預約狀態顯示中文狀態
	const getReservationStatusText = (status?: number) => {
		if (!status) return '--';
		switch (status) {
			case 1: // SCHEDULED
				return '已排定';
			case 2: // PENDING_REVIEW
				return '待紀錄';
			case 3: // COMPLETED
				return '已完成';
			case 9: // CANCELLED
				return '已取消';
			default:
				return '未知狀態';
		}
	};

	// 獲取課程類型文字
	const getCourseTypeText = () => {
		const typeMap = {
			[CourseType.PRIVATE]: '私人課',
			[CourseType.GROUP]: '團體課',
			[CourseType.INDIVIDUAL]: '個人練習',
		};
		const bkgTypeMap = {
			[CourseBkgType.FIXED]: '指定',
			[CourseBkgType.FLEXIBLE]: '預約',
		};

		return `${bkgTypeMap[courseDetail?.bkgType] || '--'}${typeMap[courseDetail?.type] || '--'}`;
	};

	// 獲取滑雪類型文字
	const getSkiTypeText = () => {
		//  CourseSkiType: 0=單板和雙板, 1=單板, 2=雙板
		const skiTypeMap: { [key: number]: string } = {
			0: '單板和雙板',
			1: '單板',
			2: '雙板',
		};
		return skiTypeMap[courseDetail?.skiType] || '--';
	};

	// 計算人數限制
	const getPersonLimit = () => {
		// EDIT mode: use reservationDetail
		if (reservationDetail?.minStudentCount && reservationDetail?.maxStudentCount) {
			return [reservationDetail.minStudentCount, reservationDetail.maxStudentCount];
		}

		// ADD mode: use courseDetail
		if (courseDetail?.coursePeople?.[0]?.minPeople && courseDetail?.coursePeople?.[0]?.maxPeople) {
			return [courseDetail.coursePeople[0].minPeople, courseDetail.coursePeople[0].maxPeople];
		}

		// No data available
		return [];
	};
	const personLimit = getPersonLimit();
	return (
		<BlockArea>
			<Stack gap={3} width='100%'>
				<Stack direction='row' gap={3}>
					<Stack gap={0.5} width='33%'>
						<Typography variant='body2' color='text.secondary'>
							預約編號
						</Typography>
						<Typography variant='body1'>{reservationDetail?.reservationNo || '--'}</Typography>
					</Stack>
					<Stack gap={0.5} width='33%'>
						<Typography variant='body2' color='text.secondary'>
							課程狀態
						</Typography>
						<Typography variant='body1'>
							{getReservationStatusText(reservationDetail?.reservationStatus) || '--'}
						</Typography>
					</Stack>
					<Stack gap={0.5} width='33%'>
						<Typography variant='body2' color='text.secondary'>
							剩餘名額
						</Typography>
						<Typography variant='body1'>
							{personLimit.length == 0 ? '--' : personLimit[1] - (displayMembers?.length || 0)}
						</Typography>
					</Stack>
				</Stack>
				<Stack direction='row' gap={3}>
					<Stack gap={0.5} width='33%'>
						<Typography variant='body2' color='text.secondary'>
							人數限制
						</Typography>
						<Typography variant='body1'>{personLimit.join(' - ')}</Typography>
					</Stack>
					<Stack gap={0.5} width='33%'>
						<Typography variant='body2' color='text.secondary'>
							課程類型
						</Typography>
						<Typography variant='body1'>
							{getCourseTypeText()} | {getSkiTypeText()}
						</Typography>
					</Stack>
					<Stack gap={0.5} width='33%'>
						<Typography variant='body2' color='text.secondary'></Typography>
						<Typography variant='body1'></Typography>
					</Stack>
				</Stack>
			</Stack>
		</BlockArea>
	);
};

export default ReservationInfo;
