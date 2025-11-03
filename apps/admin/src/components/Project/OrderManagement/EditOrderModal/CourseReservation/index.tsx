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
	orderId?: string;
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

const CourseReservation = ({ reservations = [], loading = false, size = 4, orderId }: Props) => {
	// 格式化參加人員名單
	const formatMemberNames = (reservationMembers: ReservationMember[]): string => {
		if (!reservationMembers || reservationMembers.length === 0) return '無';

		return reservationMembers.map((m) => m.orderMember?.member?.name || '未知').join('、');
	};

	// 將預約數據轉換為表格行格式
	const tableRows = new Array(size).fill(null).map((_, index) => {
		const orderReservation = reservations.find((res) => res.index == index);
		return [
			{
				width: '60px',
				label: `#${index + 1}`,
				show: true,
			},
			{
				width: '80px',
				label: orderReservation ? getStatusText(orderReservation.reservation.reservationStatus) : '未預約',
				show: true,
			},
			{
				width: '150px',
				label: orderReservation ? dayjs(orderReservation.reservation.classTime).format('YYYY/MM/DD HH:mm') : '',
				show: true,
			},
			{
				width: '60px',
				label: orderReservation ? getTeachingLevelText(orderReservation.reservation.teachingLevel) : '',
				show: true,
			},
			{
				width: '300px',
				label: orderReservation ? formatMemberNames(orderReservation.reservation.reservationMembers) : '',
				show: true,
			},
			{
				width: '150px',
				show: true,
				component: (
					<Button
						endIcon={<RoundedArrowTopRight />}
						onClick={() => {
							if (orderReservation) {
								// 已有預約：跳轉至檢視模式
								window.open(`/reservation-management/indoor-course?reservationId=${orderReservation.id}`, '_blank');
							} else {
								// 尚未預約：跳轉至新增模式，帶上 orderId 和 index
								window.open(
									`/reservation-management/indoor-course?action=add&orderId=${orderId}&index=${index}`,
									'_blank',
								);
							}
						}}
					>
						{orderReservation ? '檢視' : '立即預約'}
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
