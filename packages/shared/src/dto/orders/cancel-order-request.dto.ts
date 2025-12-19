import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CancelOrderRequestDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(500, { message: '取消原因不得超過500字' })
  reason: string;
}
