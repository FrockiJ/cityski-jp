export interface OrderReservationResponseDto {
  id: string;
  orderId: string;
  reservationId: string | null;
  index: number;
  order?: {
    id: string;
    no: string;
  };
  reservation?: {
    id: string;
    reservationNo: number;
    classTime: Date;
    teachingLevel: number;
    instructor: string | null;
  };
}
