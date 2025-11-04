import { Expose, Type } from 'class-transformer';
import { OrderMemberResponseDto } from '../order-members/order-member-response.dto';

export class ReservationMemberResponseDto {
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
  @Type(() => OrderMemberResponseDto)
  orderMember?: OrderMemberResponseDto;
}
