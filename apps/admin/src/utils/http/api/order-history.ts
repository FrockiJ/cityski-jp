import { ResponseWrapper, OrderHistoryResponseDTO, CreateOrderHistoryRequestDTO } from '@repo/shared';
import http from '@/utils/http/instance';

export interface OrderHistory extends OrderHistoryResponseDTO {}

export const getOrderHistoryByOrderId = (orderId: string) =>
  http.get<ResponseWrapper<OrderHistory[]>>(`/api/order-history/order/${orderId}`);

export const getOrderHistory = (id: string) =>
  http.get<ResponseWrapper<OrderHistory>>(`/api/order-history/${id}`);

export const createOrderHistory = (data: CreateOrderHistoryRequestDTO) =>
  http.post<ResponseWrapper<OrderHistory>>('/api/order-history', data);