import { IsDateString, IsEnum, IsOptional, IsString, IsUUID } from "class-validator";

export enum PaymentMethod {
  CREDIT = 'CREDIT',
  CASH = 'CASH',
}

export class SettleTransactionRequestDTO {
  @IsUUID()
  orderId: string;

  @IsDateString()
  balanceDate: string;

  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @IsOptional()
  @IsString()
  invoice?: string;
}
