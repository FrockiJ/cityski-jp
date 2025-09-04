import { Exclude, Expose } from "class-transformer";

export class MemberResponseDto {
  @Expose()
  id: string;

  @Expose()
  no: string;

  @Expose()
  name: string;

  @Expose()
  type: string;

  @Expose()
  email: string | null;

  @Expose({ name: "line_id" })
  lineId: string | null;

  @Expose({ name: "line_name" })
  lineName: string | null;

  @Expose({ name: "line_oa" })
  lineOa: string | null;

  @Expose()
  avatar: string | null;

  @Expose()
  phone: string | null;

  @Expose()
  snowboard: number;

  @Expose()
  skis: number;

  @Expose()
  birthday: Date | null;

  @Expose()
  note: string | null;

  @Expose()
  status: number | null;

  @Expose()
  createdTime: string | null;

  @Expose()
  updatedTime: string | null;

  @Exclude()
  password: string;

  @Exclude()
  refresh: string | null;
}
