import { MemberTypeEnum } from '@repo/shared';

export class UpdateMemberDTO {
  name?: string;

  email?: string;

  type?: MemberTypeEnum;

  lineOa?: string;

  lineName?: string;

  lineId?: string;

  snowboardLevel?: number;

  skiLevel?: number;

  birthday?: string;

  phone?: string;

  avatar?: string;

  note?: string;
}
