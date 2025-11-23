import { Expose, Type } from "class-transformer";
import { MemberResponseDto } from "../member/get-members-response.dto";
import { CourseSkiType, CourseType } from "../../constants/enums";


class OrderReservationDto {
  @Expose()
  id: string;

  @Expose()
  index: number;

  @Expose()
  orderId: string;

  @Expose()
  reservationId: string;
}

class OrderDto {
  @Expose()
  id: string;

  @Expose()
  no: string;

  @Expose()
  status: number;

  @Expose()
  planNumber: number;

  @Expose()
  type: CourseType;

  @Expose()
  skiType: CourseSkiType;

  @Expose()
  coursePlanId: string;

  @Expose()
  @Type(() => OrderReservationDto)
  orderReservations: OrderReservationDto[];
}

export class OrderMemberSearchResponseDto {
  @Expose()
  id: string;

  @Expose()
  orderId: string;

  @Expose()
  memberId: string;

  @Expose()
  active: boolean;

  @Expose()
  @Type(() => MemberResponseDto)
  member: MemberResponseDto;

  @Expose()
  @Type(() => OrderDto)
  order: OrderDto;
}
