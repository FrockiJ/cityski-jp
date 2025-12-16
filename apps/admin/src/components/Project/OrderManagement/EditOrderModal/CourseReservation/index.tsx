import React, { useEffect, useState } from 'react';
import {
	ReservationStatus,
	SkiAndSnowboardLevel,
	OrderReservationResponseDto,
	ReservationMemberDto,
	ModalType,
	CourseType,
	CourseStatusType,
	DialogAction,
	SkiAndSnowboardLevelEnum,
	GetOrderDetailResponseDTO,
	OrderStatus,
} from '@repo/shared';
import dayjs from 'dayjs';

import { Button } from '@/components/Common/CIBase/CoreDynamicTable/CoreFilter/styles';
import FormikModalTable from '@/components/Common/CIBase/Formik/FormikModalTable';
import useModalProvider from '@/hooks/useModalProvider';
import AddEditReservationIndoorModal from '@/components/Project/ReservationManagement/AddEditReservationIndoorModal';

type Props = {
	reservations?: OrderReservationResponseDto[];
	loading?: boolean;
	size?: number;
	orderId?: string;
	orderDetail: GetOrderDetailResponseDTO;
	refetchReservations?: () => void;
	refetchOrderDetail?: () => void;
};

// 輔助函數：獲取狀態文字
const getStatusText = (status: number): string => {
	switch (status) {
		case ReservationStatus.SCHEDULED:
			return '已排定';
		case ReservationStatus.PENDING_REVIEW:
			return '待紀錄';
		case ReservationStatus.COMPLETED:
			return '已完成';
		case ReservationStatus.CANCELED:
			return '已取消';
		default:
			return '未知狀態';
	}
};

// 輔助函數：獲取教學等級文字
const getTeachingLevelText = (level: SkiAndSnowboardLevelEnum): string => {
	return SkiAndSnowboardLevel[level as keyof typeof SkiAndSnowboardLevel] || '未知等級';
};

const CourseReservation = ({
	reservations = [],
	loading = false,
	size = 4,
	orderId,
	refetchReservations: parentRefetchReservations,
	refetchOrderDetail: parentRefetchOrderDetail,
	orderDetail,
}: Props) => {
	const modal = useModalProvider();

	// 格式化參加人員名單
	const formatMemberNames = (reservationMembers: ReservationMemberDto[]): string => {
		if (!reservationMembers || reservationMembers.length === 0) return '無';

		return reservationMembers.map((m) => m.orderMember?.member?.name || '未知').join('、');
	};

	// 處理開啟預約 Modal
	const handleOpenReservationModal = (reservationId?: string, index?: number) => {
		const modalType = reservationId ? ModalType.EDIT : ModalType.ADD;
		const title = reservationId ? '檢視預約' : '立即預約';

		modal.openModal({
			title: title,
			width: 1200,
			height: 800,
			fullScreen: true,
			center: true,
			marginBottom: true,
			noEscAndBackdrop: true,
			noAction: true,
			onClose: (action) => {
				if (action === DialogAction.CONFIRM) {
					// 重新取得父組件（EditOrderModal）的預約資料
					parentRefetchReservations?.();
					parentRefetchOrderDetail?.();
				}
			},
			children: (
				<AddEditReservationIndoorModal
					modalType={modalType}
					courseType={CourseType.PRIVATE}
					courseStatusType={CourseStatusType.PUBLISHED}
					reservationId={reservationId}
					orderId={orderId}
					reservationIndex={index}
					handleRefresh={() => {
						// 重新取得父組件（EditOrderModal）的預約資料
						parentRefetchReservations?.();
						parentRefetchOrderDetail?.();
					}}
				/>
			),
		});
	};

	// 將預約數據轉換為表格行格式
	const tableRows = new Array(size).fill(null).map((_, index) => {
		const orderReservation = reservations.filter(res=> res.reservation?.reservationStatus !== ReservationStatus.CANCELED).find((res) => res.index == index);
		// 檢查是否為已取消的預約
		const isCanceled = orderReservation?.reservation?.reservationStatus === ReservationStatus.CANCELED;
		// 已取消的預約視為未預約
		const hasActiveReservation = orderReservation?.reservation && !isCanceled;

		return [
			{
				width: '60px',
				label: `#${index + 1}`,
				show: true,
			},
			{
				width: '80px',
				label: hasActiveReservation ? getStatusText(orderReservation!.reservation!.reservationStatus) : '未預約',
				show: true,
			},
			{
				width: '150px',
				label: hasActiveReservation
					? dayjs(orderReservation!.reservation!.classTime).format('YYYY/MM/DD HH:mm')
					: '',
				show: true,
			},
			{
				width: '60px',
				label: hasActiveReservation ? getTeachingLevelText(orderReservation!.reservation!.teachingLevel) : '',
				show: true,
			},
			{
				width: '300px',
				label: hasActiveReservation && orderReservation!.reservation!.reservationMembers
					? formatMemberNames(orderReservation!.reservation!.reservationMembers)
					: '',
				show: true,
			},
			{
				width: '150px',
				show: true,
				component: (
					<Button
						onClick={() => {
							if (hasActiveReservation) {
								// 已有有效預約：開啟檢視模式的 Modal
								handleOpenReservationModal(orderReservation?.reservation?.id, undefined);
							} else {
								// 訂購成功的時候才可以預約
								orderDetail.status === OrderStatus.ORDER_SUCCESSFUL &&
									// 尚未預約或已取消：開啟新增模式的 Modal，帶上 orderId 和 index
									handleOpenReservationModal(undefined, index);
							}
						}}
					>
						{hasActiveReservation ? '檢視' : orderDetail.status === OrderStatus.ORDER_SUCCESSFUL ? '立即預約' : ''}
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
