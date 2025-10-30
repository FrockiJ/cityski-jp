import React, { useEffect, useState } from 'react';
import { ReservationStatus, SkiAndSnowboardLevel } from '@repo/shared';
import dayjs from 'dayjs';

import { Button } from '@/components/Common/CIBase/CoreDynamicTable/CoreFilter/styles';
import FormikModalTable from '@/components/Common/CIBase/Formik/FormikModalTable';
import RoundedArrowTopRight from '@/components/Common/Icon/RoundedArrowTopRight';
import { getReservationMembers, ReservationMember } from '@/utils/http/api/reservation-members';

type Props = {
	reservations?: any[];
	loading?: boolean;
	size?: number;
};

// 輔助函數：獲取狀態文字
const getStatusText = (status: number): string => {
	switch (status) {
		case ReservationStatus.SCHEDULED:
			return '已排定';
		case ReservationStatus.COMPLETED:
			return '已完成';
		case ReservationStatus.CANCELED:
			return '已取消';
		default:
			return '未知狀態';
	}
};

// 輔助函數：獲取教學等級文字
const getTeachingLevelText = (level: number): string => {
	return SkiAndSnowboardLevel[level as keyof typeof SkiAndSnowboardLevel] || '未知等級';
};

const CourseReservation = ({ reservations = [], loading = false, size = 4 }: Props) => {
	const [reservationMembers, setReservationMembers] = useState<Record<string, ReservationMember[]>>({});
	const [loadingMembers, setLoadingMembers] = useState(false);

	// 獲取所有預約的成員信息
	useEffect(() => {
		if (reservations && reservations.length > 0) {
			const fetchAllMembers = async () => {
				setLoadingMembers(true);
				try {
					const membersData: Record<string, ReservationMember[]> = {};

					await Promise.all(
						reservations.map(async (reservation) => {
							try {
								const response = await getReservationMembers(reservation.id);
								membersData[reservation.id] = response.result || [];
							} catch (error) {
								console.error(`Failed to fetch members for reservation ${reservation.id}:`, error);
								membersData[reservation.id] = [];
							}
						}),
					);

					setReservationMembers(membersData);
				} catch (error) {
					console.error('Failed to fetch reservation members:', error);
				} finally {
					setLoadingMembers(false);
				}
			};

			fetchAllMembers();
		}
	}, [reservations]);

	// 格式化參加人員名單
	const formatMemberNames = (reservationId: string): string => {
		const members = reservationMembers[reservationId] || [];
		if (members.length === 0) return '無';
		return members.map((m) => m.orderMember?.member?.name || '未知').join('、');
	};

	// 將預約數據轉換為表格行格式
	const tableRows = new Array(size).fill(null).map((_, index) => {
		const reservation = reservations.find((res) => res.index == index);
		return [
			{
				width: '60px',
				label: `#${index + 1}`,
				show: true,
			},
			{
				width: '80px',
				label: reservation ? getStatusText(reservation.reservationStatus) : '未預約',
				show: true,
			},
			{
				width: '150px',
				label: reservation ? dayjs(reservation.classTime).format('YYYY/MM/DD HH:mm') : '',
				show: true,
			},
			{
				width: '60px',
				label: reservation ? getTeachingLevelText(reservation.teachingLevel) : '',
				show: true,
			},
			{
				width: '300px',
				label: reservation ? (loadingMembers ? '載入中...' : formatMemberNames(reservation.id)) : '',
				show: true,
			},
			{
				width: '150px',
				show: true,
				component: (
					<Button
						endIcon={<RoundedArrowTopRight />}
						onClick={() => {
							window.open(`/reservation-management/indoor-course?reservationId=${reservation.id}`, '_blank');
						}}
					>
						{reservation ? '檢視' : '立即預約'}
					</Button>
				),
			},
		];
	});

	// 如果沒有預約數據，顯示空狀態
	// if (!loading && (!reservations || reservations.length === 0)) {
	// 	return <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>此訂單尚無課程預約</div>;
	// }

	return (
		<div>
			<FormikModalTable
				name='courseReservationTable'
				tableHeader={[
					{
						label: '',
						width: '60px',
						show: true,
					},
					{
						label: '狀態',
						width: '80px',
						show: true,
					},
					{
						label: '時間',
						width: '150px',
						show: true,
					},
					{
						label: '等級',
						width: '60px',
						show: true,
					},
					{
						label: '參加人員',
						width: '300px',
						show: true,
					},
					{
						label: ' ',
						width: '150px',
						show: true,
					},
				]}
				tableRowCell={loading ? [] : tableRows}
			/>
		</div>
	);
};

export default CourseReservation;
