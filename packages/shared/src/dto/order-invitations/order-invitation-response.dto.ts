import { Expose, Type } from 'class-transformer';

class InviterDto {
  @Expose()
  id: string;

  @Expose()
  name: string;
}

class OrderInfoDto {
  @Expose()
  id: string;

  @Expose()
  no: string;
}

export class OrderInvitationResponseDto {
  @Expose()
  id: string;

  @Expose()
  orderId: string;

  @Expose()
  inviterUserId: string;

  @Expose()
  inviteToken: string;

  @Expose()
  status: number;

  @Expose()
  expiresAt: Date;

  @Expose()
  redeemedByUserId: string | null;

  @Expose()
  redeemedAt: Date | null;

  @Expose()
  inviteeType: string;

  @Expose()
  createdTime: Date;

  @Expose()
  @Type(() => InviterDto)
  inviter?: InviterDto;

  @Expose()
  @Type(() => OrderInfoDto)
  order?: OrderInfoDto;

  @Expose()
  inviteLink?: string;
}
