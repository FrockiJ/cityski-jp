import { GetOrderDetailResponseDTO, ResponseWrapper, OrderReservationResponseDto, SettleTransactionRequestDTO, PayDepositRequestDTO } from '@repo/shared';
import { http } from '@/utils/http/instance';

export const getOrderDetail = (orderId: string) => {
	return http.get<ResponseWrapper<GetOrderDetailResponseDTO>>(`/api/orders/${orderId}`);
};

export const getOrderReservations = (orderId: string) => {
	return http.get<ResponseWrapper<OrderReservationResponseDto[]>>(`/api/orders/${orderId}/reservations`);
};

export const settleTransaction = (data: SettleTransactionRequestDTO) => {
	return http.patch<ResponseWrapper<any>>(`/api/transactions/settle`, data);
};

// ============ DEV ONLY - REMOVE BEFORE PRODUCTION ============
export const payDepositForDev = (data: PayDepositRequestDTO) => {
	return http.patch<ResponseWrapper<any>>(`/api/transactions`, data);
};
// ============================================================
