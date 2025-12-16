import { Expose } from 'class-transformer';

export class InventoryItemDTO {
  @Expose()
  customerName: string;

  @Expose()
  customerPhone: string;

  @Expose()
  orderId: string;

  @Expose()
  orderNo: string;

  @Expose()
  courseName: string;

  @Expose()
  participantCount: number;

  @Expose()
  totalAmount: number;

  @Expose()
  balance: number;

  @Expose()
  monthlyUsage: { [key: string]: number };
}

export class InventorySummaryDTO {
  @Expose()
  totalCount: number;

  @Expose()
  totalAmount: number;

  @Expose()
  totalBalance: number;
}

export class InventoryDateRangeDTO {
  @Expose()
  from: string;

  @Expose()
  to: string;
}

export class GetInventoryResponseDTO {
  @Expose()
  items: InventoryItemDTO[];

  @Expose()
  summary: InventorySummaryDTO;

  @Expose()
  dateRange: InventoryDateRangeDTO;
}
