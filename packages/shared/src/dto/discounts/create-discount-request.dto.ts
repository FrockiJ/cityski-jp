import {
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Matches,
  Min,
} from "class-validator";
import { DiscountStatus, DiscountType } from "../../constants/enums";

export class CreateDiscountRequestDTO {
  @IsUUID()
  departmentId: string;

  @IsString()
  @Length(2, 5, { message: "折扣碼長度最少2碼，最多5碼" })
  @Matches(/^[A-Za-z0-9]+$/, {
    message: "折扣碼只能包含英文大小寫和數字，且不能包含空格跟符號",
  })
  code: string;

  @IsNumber()
  status: DiscountStatus;

  @IsString()
  type: DiscountType;

  @IsNumber()
  @Min(0, { message: "折扣必須大於等於0" })
  discount: number;

  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: "endDate日期格式必須為YYYY-MM-DD",
  })
  endDate: string;

  @IsNumber()
  @Min(0, { message: "人數限制必須大於等於0" })
  usageLimit: number;

  @IsString()
  @IsOptional()
  note: string;
}
