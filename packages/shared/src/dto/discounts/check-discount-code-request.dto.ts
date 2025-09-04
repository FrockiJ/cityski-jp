import { IsString, IsUUID } from "class-validator";

export class CheckDiscountCodeRequestDTO {
  @IsUUID()
  departmentId: string;

  @IsString()
  code: string;
}
