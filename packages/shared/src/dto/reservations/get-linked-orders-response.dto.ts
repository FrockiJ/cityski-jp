export interface LinkedOrderInfo {
  orderId: string;
  orderNo: string;
  index: number;
  orderReservationId: string;
}

export interface GetLinkedOrdersResponseDto {
  reservationId: string;
  linkedOrders: LinkedOrderInfo[];
}
