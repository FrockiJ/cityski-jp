import http from '@/utils/http/instance';
import { CourseType } from '@repo/shared';

// Raw response from API before transformation
interface RawReservationSlot {
	id: string;
	startTime: Date;
	endTime: Date;
	courseName: string;
	currentBookedCount: number;
	maxCapacity: number;
	status: 'available' | 'full' | 'closed';
	courseType: string; // Backend sends this as string
	isMixed: boolean;
	departmentName: string;
	venueName: string;
	instructorName?: string;
}

interface RawGetReservationSlotsResponseData {
	slots: RawReservationSlot[];
	totalCount: number;
}

interface RawGetReservationSlotsResponse {
	statusCode: number;
	message: string;
	result: RawGetReservationSlotsResponseData;
}

// Transformed response with proper types
export interface ReservationSlot {
	id: string;
	startTime: Date;
	endTime: Date;
	courseName: string;
	currentBookedCount: number;
	maxCapacity: number;
	status: 'available' | 'full' | 'closed';
	courseType: CourseType;
	isMixed: boolean;
	departmentName: string;
	venueName: string;
	instructorName?: string;
}

export interface GetReservationSlotsResponseData {
	slots: ReservationSlot[];
	totalCount: number;
}

export interface GetReservationSlotsResponse {
	statusCode: number;
	message: string;
	result: GetReservationSlotsResponseData;
}

export interface GetReservationSlotsParams {
	branch_id: string;
	start_date: string;
	end_date: string;
	course_type?: string;
	instructor_id?: string;
}

// Transform raw slot to properly typed slot
const transformSlot = (rawSlot: RawReservationSlot): ReservationSlot => {
	const transformedSlot: ReservationSlot = {
		id: rawSlot.id,
		startTime: rawSlot.startTime,
		endTime: rawSlot.endTime,
		courseName: rawSlot.courseName,
		currentBookedCount: rawSlot.currentBookedCount,
		maxCapacity: rawSlot.maxCapacity,
		status: rawSlot.status,
		courseType: rawSlot.courseType as CourseType,
		isMixed: rawSlot.isMixed,
		departmentName: rawSlot.departmentName,
		venueName: rawSlot.venueName,
		instructorName: rawSlot.instructorName,
	};
	return transformedSlot;
};

// Transform raw API response to properly typed response
const transformReservationSlots = (response: RawGetReservationSlotsResponse): GetReservationSlotsResponse => {
	return {
		statusCode: response.statusCode,
		message: response.message,
		result: {
			slots: response.result.slots.map(transformSlot),
			totalCount: response.result.totalCount,
		},
	};
};

export const getReservationSlots = async (
	params: GetReservationSlotsParams,
): Promise<GetReservationSlotsResponse> => {
	const response = await http.get<RawGetReservationSlotsResponse>('/api/reservations/slots', params);
	return transformReservationSlots(response);
};
