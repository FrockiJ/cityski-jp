import { GetOrderDetailResponseDTO, ResponseWrapper, ReservationResponseDto } from '@repo/shared';
import { http } from '@/utils/http/instance';

export const getOrderDetail = (orderId: string) => {
	return http.get<ResponseWrapper<GetOrderDetailResponseDTO>>(`/api/orders/${orderId}`);
};

export const getOrderReservations = (orderId: string) => {
	return http.get<ResponseWrapper<ReservationResponseDto[]>>(`/api/orders/${orderId}/reservations`);
};