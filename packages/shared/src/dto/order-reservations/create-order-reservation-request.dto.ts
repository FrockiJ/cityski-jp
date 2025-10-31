import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateOrderReservationRequestDto {
  @IsString()
  orderId: string;

  @IsOptional()
  @IsString()
  reservationId?: string;

  @IsNumber()
  index: number;
}
