import { IsNumber, IsUUID } from "class-validator";
import { DiscountStatus } from "src/constants/enums";

export class UpdateDiscountRequestDTO {
  @IsUUID()
  id: string;

  @IsNumber()
  status: DiscountStatus;
}
