import { GetOrderDetailResponseDTO, ResponseWrapper } from '@repo/shared';
import { http } from '@/utils/http/instance';

export const getOrderDetail = (orderId: string) => {
	return http.get<ResponseWrapper<GetOrderDetailResponseDTO>>(`/api/orders/${orderId}`);
};