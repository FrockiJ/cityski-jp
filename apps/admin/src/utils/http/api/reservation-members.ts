import {
  ResponseWrapper,
  Response,
  ReservationMemberResponseDto,
  CreateReservationMemberRequestDto,
  UpdateReservationMemberRequestDto,
} from '@repo/shared';
import http from '@/utils/http/instance';

export const getReservationMembers = (reservationId: string) =>
  http.get<ResponseWrapper<ReservationMemberResponseDto[]>>(`/api/reservation-members/reservation/${reservationId}`);

export const createReservationMember = (data: CreateReservationMemberRequestDto) =>
  http.post<ResponseWrapper<ReservationMemberResponseDto>>('/api/reservation-members', data);

export const updateReservationMember = (id: string, data: UpdateReservationMemberRequestDto) =>
  http.patch<ResponseWrapper<ReservationMemberResponseDto>>(`/api/reservation-members/${id}`, data);

export const deleteReservationMember = (id: string) =>
  http.delete<Response>(`/api/reservation-members/${id}`);
