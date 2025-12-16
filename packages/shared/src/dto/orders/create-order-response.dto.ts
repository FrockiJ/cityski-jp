import { Expose } from 'class-transformer';
import { OrderStatusEnum } from '../../constants/enums';

export class CreateOrderResponseDTO {
  @Expose()
  id: string;

  @Expose()
  no: string;

  @Expose()
  status: OrderStatusEnum;

  @Expose()
  expDate: Date;

  @Expose()
  depositAmt: number;
}
