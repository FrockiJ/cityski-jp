import { SkiAndSnowboardLevelEnum } from '../../constants/enums';

export interface GetReservationDetailResponseDto {
  id: string;
  reservationNo: number;
  reservationStatus: number;
  classTime: Date;
  teachingLevel: SkiAndSnowboardLevelEnum;
  instructor: string | null;
  departmentName: string;
  createdTime: Date;
  updatedTime: Date;
  linkedOrders?: Array<{
    orderId: string;
    orderNo: string;
    index: number;
    orderReservationId: string;
  }>;
  reservationMembers?: Array<{
    id: string;
    reservationId: string;
    orderMemberId: string;
    note?: string;
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
  }>;
}

export class ReservationResponseDto {
  id: string;
  reservationNo: number;
  reservationStatus: number;
  classTime: Date;
  teachingLevel: SkiAndSnowboardLevelEnum;
  instructor: string | null;
  departmentId: string;
  createdTime: Date;
  updatedTime: Date;
  reservationMembers?: Array<{
    id: string;
    reservationId: string;
    orderMemberId: string;
    orderMember?: {
      id: string;
      orderId: string;
      memberId: string;
      order: {
        id: string;
        no: string;
        status: string;
        type: number;
        planNumber: number
      };
    };
  }>;
 
}