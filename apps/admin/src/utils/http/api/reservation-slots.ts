import http from '@/utils/http/instance';

export interface ReservationSlot {
	id: string;
	startTime: Date;
	endTime: Date;
	courseName: string;
	currentBookedCount: number;
	maxCapacity: number;
	status: 'available' | 'full' | 'closed';
	courseType: number;
	isMixed: boolean;
	departmentName: string;
	venueName: string;
	instructorName?: string;
}

export interface GetReservationSlotsResponse {
	slots: ReservationSlot[];
	totalCount: number;
}

export interface GetReservationSlotsParams {
	branch_id: string;
	start_date: string;
	end_date: string;
	course_type?: number;
	instructor_id?: string;
}

export const getReservationSlots = (params: GetReservationSlotsParams) =>
	http.get<GetReservationSlotsResponse>('/api/reservations/slots', { params });
