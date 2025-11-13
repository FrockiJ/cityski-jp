import { Exclude, Expose, Type } from "class-transformer";

class MemberDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  phone: string | null;

  @Expose()
  email: string | null;

  @Expose()
  birthday: Date | null;

  @Expose()
  avatar: string | null;

  @Expose()
  skis: number;

  @Expose()
  snowboard: number;

  @Exclude()
  password?: string;

  @Exclude()
  refresh?: string;
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
}

export class OrderMemberResponseDto {
  @Expose()
  id: string;

  @Expose()
  orderId: string;

  @Expose()
  memberId: string;

  @Expose()
  active: boolean;

  @Expose()
  @Type(() => MemberDto)
  member: MemberDto;

  @Expose()
  @Type(() => OrderDto)
  order: OrderDto;
}
