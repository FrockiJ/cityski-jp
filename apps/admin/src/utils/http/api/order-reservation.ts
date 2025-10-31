import {
  CreateOrderReservationRequestDto,
  UpdateOrderReservationRequestDto,
  OrderReservationResponseDto,
  GetLinkedOrdersResponseDto,
  Response,
  ResponseWrapper
} from '@repo/shared';
import http from '@/utils/http/instance';

/**
 * 建立 OrderReservation 連結
 */
export const createOrderReservation = (data: CreateOrderReservationRequestDto) =>
  http.post<ResponseWrapper<OrderReservationResponseDto>>('/api/order-reservations', data);

/**
 * 更新 OrderReservation
 */
export const updateOrderReservation = (id: string, data: UpdateOrderReservationRequestDto) =>
  http.put<ResponseWrapper<OrderReservationResponseDto>>(`/api/order-reservations/${id}`, data);

/**
 * 刪除 OrderReservation 連結
 */
export const deleteOrderReservation = (id: string) =>
  http.delete<Response>(`/api/order-reservations/${id}`);

/**
 * 根據 orderId 取得所有 OrderReservations
 */
export const getOrderReservationsByOrderId = (orderId: string) =>
  http.get<ResponseWrapper<OrderReservationResponseDto[]>>(`/api/order-reservations/order/${orderId}`);

/**
 * 根據 reservationId 取得所有 OrderReservations
 */
export const getOrderReservationsByReservationId = (reservationId: string) =>
  http.get<ResponseWrapper<OrderReservationResponseDto[]>>(`/api/order-reservations/reservation/${reservationId}`);

/**
 * 根據 id 取得單一 OrderReservation
 */
export const getOrderReservation = (id: string) =>
  http.get<ResponseWrapper<OrderReservationResponseDto>>(`/api/order-reservations/${id}`);

/**
 * 取得連結到某個 reservation 的所有訂單
 */
export const getLinkedOrders = (reservationId: string) =>
  http.get<ResponseWrapper<GetLinkedOrdersResponseDto>>(`/api/reservations/${reservationId}/linked-orders`);
