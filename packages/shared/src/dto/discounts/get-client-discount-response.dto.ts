import { DiscountStatus, DiscountType } from "../../constants/enums";
export class GetClientDiscountResponseDTO {
  id: string;

  departmentId: string;

  code: string;

  type: DiscountType;

  discount: number;

  status: DiscountStatus;

  usageLimit: number;

  usageCount: number;
}
