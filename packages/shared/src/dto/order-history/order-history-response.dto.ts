import { Expose } from 'class-transformer';

export class OrderHistoryResponseDTO {
  @Expose()
  id: string;

  @Expose()
  orderId: string;

  @Expose()
  event: string;

  @Expose()
  operator: string;

  @Expose()
  time: Date;

  @Expose()
  reason?: string;

  @Expose()
  order?: {
    id: string;
    no: string;
  };
}
