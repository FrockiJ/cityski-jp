import { Expose } from "class-transformer";

export class OrderMemberSearchResponseDto {
  @Expose()
  id: string;

  @Expose()
  orderId: string;

  @Expose()
  memberId: string;

  @Expose()
  courseCount: number;

  @Expose()
  courseLeft: number;

  @Expose()
  member: {
    id: string;
    name: string;
    phone: string | null;
    birthday: Date | null;
    avatar: string | null;
    skis: number;
    snowboard: number;
  };

  @Expose()
  order: {
    id: string;
    no: string;
    status: string;
  };
}
