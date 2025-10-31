import { IsString, IsNumber, IsOptional } from 'class-validator';

export class UpdateOrderReservationRequestDto {
  @IsOptional()
  @IsString()
  reservationId?: string;

  @IsOptional()
  @IsNumber()
  index?: number;
}
