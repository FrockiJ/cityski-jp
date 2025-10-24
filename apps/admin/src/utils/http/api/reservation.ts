import { 
  CreateReservationRequestDto,
  GetReservationsRequestDto,
  GetReservationDetailResponseDto,
  ResWithPaginationDTO,
  ReservationResponseDto,
  ResponseWrapper,
  Response 
} from '@repo/shared';
import http from '@/utils/http/instance';

export const getReservations = (params?: GetReservationsRequestDto) => 
  http.get<ResWithPaginationDTO<ReservationResponseDto[]>>('/api/reservations', { params });

export const getReservationDetail = (id: string) => 
  http.get<ResponseWrapper<GetReservationDetailResponseDto>>(`/api/reservations/${id}`);

export const createReservation = (data: CreateReservationRequestDto) => 
  http.post<Response>('/api/reservations', data);

export const updateReservationStatus = (id: string, data: { status: number }) => 
  http.put<Response>(`/api/reservations/${id}/status`, data);

export const updateReservation = (id: string, data: CreateReservationRequestDto) => 
  http.put<Response>(`/api/reservations/${id}`, data);