import { IsDate, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateOrderExpDateRequestDto {
  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  expDate: Date;
}
