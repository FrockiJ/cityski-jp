export class CreateOrderHistoryRequestDTO {
  orderId: string;
  event: string;
  operator: string;
  reason?: string;
}
