import { IsString, IsUUID } from 'class-validator';

export class CreateOrderInvitationRequestDto {
  @IsUUID()
  orderId: string;

  @IsString()
  inviteeType: 'adult' | 'child';
}
