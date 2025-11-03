export interface OrderHistoryResponseDto {
  id: string;
  orderId: string;
  event: string;
  operator: string;
  time: Date;
  reason?: string;
  order?: {
    id: string;
    no: string;
  };
}

export interface CreateOrderHistoryRequestDto {
  orderId: string;
  event: string;
  operator: string;
  reason?: string;
}

export interface UpdateOrderHistoryRequestDto {
  event?: string;
  operator?: string;
  reason?: string;
}