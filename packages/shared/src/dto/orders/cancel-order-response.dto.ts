import { Expose } from 'class-transformer';

export class CancelOrderResponseDto {
  @Expose()
  success: boolean;

  @Expose()
  message: string;

  @Expose()
  orderId: string;

  @Expose()
  orderNo: string;

  @Expose()
  canceledReservationsCount: number;
}
