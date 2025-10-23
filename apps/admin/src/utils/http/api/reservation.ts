import { http } from '@/utils/http/instance';


export const getReservations = (params?: any) => http.get('/reservations', { params });

export const getReservationDetail = (id: string) => http.get(`/reservations/${id}`);

export const createReservation = (data: any) => http.post('/reservations', data);

export const updateReservationStatus = (id: string, data: { status: any }) => 
  http.put(`/reservations/${id}/status`, data);