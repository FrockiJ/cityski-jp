import { ResponseWrapper ,Response} from '@repo/shared';
import http from '@/utils/http/instance';

export interface ReservationMember {
  id: string;
  reservationId: string;
  orderMemberId: string;
  note?: string;
  attended: boolean;
  orderMember?: {
    id: string;
    orderId: string;
    memberId: string;
    member: {
      id: string;
      name: string;
      phone: string | null;
      birthday: Date | null;
      avatar: string | null;
      skis: number;
      snowboard: number;
    };
    order: {
      id: string;
      no: string;
      status: string;
    };
  };
}

export interface CreateReservationMemberDto {
  reservationId: string;
  orderMemberId: string;
  note?: string;
  attended?: boolean;
}

export const getReservationMembers = (reservationId: string) =>
  http.get<ResponseWrapper<ReservationMember[]>>(`/api/reservation-members/reservation/${reservationId}`);

export const createReservationMember = (data: CreateReservationMemberDto) =>
  http.post<ResponseWrapper<ReservationMember>>('/api/reservation-members', data);

export const updateReservationMember = (id: string, data: Partial<CreateReservationMemberDto>) =>
  http.patch<ResponseWrapper<ReservationMember>>(`/api/reservation-members/${id}`, data);

export const deleteReservationMember = (id: string) =>
  http.delete<Response>(`/api/reservation-members/${id}`);
