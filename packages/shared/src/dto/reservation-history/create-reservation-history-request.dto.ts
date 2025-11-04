export class CreateReservationHistoryRequestDto {
  reservationId: string;
  event: string;
  operator: string;
  reason?: string;
}
