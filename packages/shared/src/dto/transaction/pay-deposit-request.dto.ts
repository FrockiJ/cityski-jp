import { IsNumber, IsString, IsUUID } from "class-validator";
import {
  CourseBkgType,
  CoursePlanTypeEnum,
  CourseSkiType,
  CourseType,
  OrderChannelEnum,
  OrderStatusEnum,
} from "src/constants/enums";

export class PayDepositRequestDTO {
  @IsUUID()
  orderId: string;

  // @IsUUID()
  // depositId: string;

  @IsString()
  account: string;

  @IsNumber()
  amount: number;
}
