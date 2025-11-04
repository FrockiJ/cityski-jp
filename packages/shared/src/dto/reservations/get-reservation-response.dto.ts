import { Expose } from 'class-transformer';
import { SkiAndSnowboardLevelEnum } from '../../constants/enums';
import { CourseType,
  
  CourseSkiType
} from "src/constants/enums";
export class GetReservationDetailResponseDto {
  @Expose()
  id: string;

  @Expose()
  reservationNo: number;

  @Expose()
  reservationStatus: number;

  @Expose()
  classTime: Date;

  @Expose()
  teachingLevel: SkiAndSnowboardLevelEnum;

  @Expose()
  instructor: string | null;

  @Expose()
  departmentName: string;

  @Expose()
  createdTime: Date;

  @Expose()
  updatedTime: Date;

  @Expose()
  minStudentCount: number;
  @Expose()
  maxStudentCount: number;

  @Expose()
  linkedOrders?: Array<{
    orderId: string;
    orderNo: string;
    index: number;
    orderReservationId: string;
  }>;

  @Expose()
  courseType: CourseType;
  @Expose()
  skiType: CourseSkiType;

  @Expose()
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
  @Expose()
  id: string;

  @Expose()
  reservationNo: number;

  @Expose()
  reservationStatus: number;

  @Expose()
  classTime: Date;

  @Expose()
  teachingLevel: SkiAndSnowboardLevelEnum;

  @Expose()
  instructor: string | null;

  @Expose()
  departmentId: string;

  @Expose()
  createdTime: Date;

  @Expose()
  updatedTime: Date;

  @Expose()
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