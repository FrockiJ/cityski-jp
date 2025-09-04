import { IsBoolean, IsNumber, IsString, IsUUID } from "class-validator";
import { DiscountStatus, DiscountType } from "../../constants/enums";
export class GetDiscountResponseDTO {
  @IsUUID()
  id: string;

  @IsNumber()
  status: DiscountStatus;

  @IsString()
  type: DiscountType;

  @IsNumber()
  discount: number;

  @IsNumber()
  usageLimit: number;

  @IsString()
  code: string;

  @IsString()
  note: string;

  @IsString()
  endDate: Date;

  @IsString()
  createdTime: Date;

  @IsBoolean()
  isUsed: boolean;
}
