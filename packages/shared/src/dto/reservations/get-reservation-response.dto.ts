import { SkiAndSnowboardLevelEnum } from '../../constants/enums';

export interface GetReservationDetailResponseDto {
  id: string;
  reservationNo: number;
  reservationStatus: number;
  classTime: Date;
  teachingLevel: SkiAndSnowboardLevelEnum;
  designatedCoach: string | null;
  departmentName: string;
  createdTime: Date;
  updatedTime: Date;
}

export interface ReservationResponseDto {
  id: string;
  reservationNo: number;
  reservationStatus: number;
  classTime: Date;
  teachingLevel: SkiAndSnowboardLevelEnum;
  designatedCoach: string | null;
  departmentId: string;
  createdTime: Date;
  updatedTime: Date;
  department?: {
    id: string;
    name: string;
  };
}