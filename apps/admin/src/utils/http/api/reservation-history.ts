import { ResponseWrapper } from '@repo/shared';
import http from '@/utils/http/instance';

export interface ReservationHistory {
  id: string;
  reservationId: string;
  event: string;
  operator: string;
  time: Date;
  reason?: string;
  reservation?: {
    id: string;
    reservationNo: number;
  };
}

export const getReservationHistoryByReservationId = (reservationId: string) =>
  http.get<ResponseWrapper<ReservationHistory[]>>(`/api/reservation-history/reservation/${reservationId}`);

export const getReservationHistory = (id: string) =>
  http.get<ResponseWrapper<ReservationHistory>>(`/api/reservation-history/${id}`);

export const createReservationHistory = (data: Omit<ReservationHistory, 'id' | 'time' | 'reservation'>) =>
  http.post<ResponseWrapper<ReservationHistory>>('/api/reservation-history', data);