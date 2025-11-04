import { Expose, Type } from 'class-transformer';
import { SkiAndSnowboardLevelEnum } from '../../constants/enums';

class MemberDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  phone: string | null;

  @Expose()
  birthday: Date | null;

  @Expose()
  avatar: string | null;

  @Expose()
  skis: number;

  @Expose()
  snowboard: number;
}

class OrderInfoDto {
  @Expose()
  id: string;

  @Expose()
  no: string;

  @Expose()
  status: string;
}

class OrderMemberDto {
  @Expose()
  id: string;

  @Expose()
  orderId: string;

  @Expose()
  memberId: string;

  @Expose()
  @Type(() => MemberDto)
  member: MemberDto;

  @Expose()
  @Type(() => OrderInfoDto)
  order: OrderInfoDto;
}

class ReservationMemberDto {
  @Expose()
  id: string;

  @Expose()
  reservationId: string;

  @Expose()
  orderMemberId: string;

  @Expose()
  note?: string;

  @Expose()
  attended: boolean;

  @Expose()
  @Type(() => OrderMemberDto)
  orderMember?: OrderMemberDto;
}

class ReservationDto {
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
  createdUser: string;

  @Expose()
  createdTime: Date;

  @Expose()
  updatedUser: string;

  @Expose()
  updatedTime: Date;

  @Expose()
  @Type(() => ReservationMemberDto)
  reservationMembers?: ReservationMemberDto[];
}

class OrderDto {
  @Expose()
  id: string;

  @Expose()
  no: string;
}

export class OrderReservationResponseDto {
  @Expose()
  id: string;

  @Expose()
  orderId: string;

  @Expose()
  reservationId: string | null;

  @Expose()
  index: number;

  @Expose()
  @Type(() => OrderDto)
  order?: OrderDto;

  @Expose()
  @Type(() => ReservationDto)
  reservation?: ReservationDto;
}
