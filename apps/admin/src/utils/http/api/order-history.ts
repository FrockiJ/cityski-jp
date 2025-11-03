import { ResponseWrapper, OrderHistoryResponseDto, CreateOrderHistoryRequestDto } from '@repo/shared';
import http from '@/utils/http/instance';

export interface OrderHistory extends OrderHistoryResponseDto {}

export const getOrderHistoryByOrderId = (orderId: string) =>
  http.get<ResponseWrapper<OrderHistory[]>>(`/api/order-history/order/${orderId}`);

export const getOrderHistory = (id: string) =>
  http.get<ResponseWrapper<OrderHistory>>(`/api/order-history/${id}`);

export const createOrderHistory = (data: CreateOrderHistoryRequestDto) =>
  http.post<ResponseWrapper<OrderHistory>>('/api/order-history', data);