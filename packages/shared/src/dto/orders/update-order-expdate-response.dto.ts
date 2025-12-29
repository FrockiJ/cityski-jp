import { Expose } from 'class-transformer';

export class UpdateOrderExpDateResponseDto {
  @Expose()
  id: string;

  @Expose()
  expDate: Date;

  @Expose()
  calculatedExpDate: Date;
}
