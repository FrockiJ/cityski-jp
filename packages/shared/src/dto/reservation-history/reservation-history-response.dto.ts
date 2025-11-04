import { Expose } from 'class-transformer';

export class ReservationHistoryResponseDto {
  @Expose()
  id: string;

  @Expose()
  reservationId: string;

  @Expose()
  event: string;

  @Expose()
  operator: string;

  @Expose()
  time: Date;

  @Expose()
  reason?: string;

  @Expose()
  reservation?: {
    id: string;
    reservationNo: number;
  };
}
