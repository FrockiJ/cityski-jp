export interface CreateReservationMemberRequestDto {
  reservationId: string;
  orderMemberId: string;
  note?: string;
  attended?: boolean;
}
