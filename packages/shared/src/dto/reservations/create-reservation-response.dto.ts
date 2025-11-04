import { Expose } from 'class-transformer';

export class CreateReservationResponseDTO {
  @Expose()
  id: string;

  @Expose()
  reservationNo: number;

  @Expose()
  reservationStatus: number;

  @Expose()
  classTime: Date;

  @Expose()
  departmentName: string;
}
