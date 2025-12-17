import { IsNumber, IsOptional, IsString, IsUUID } from "class-validator";
import {
  CourseBkgType,
  CoursePlanTypeEnum,
  CourseSkiType,
  CourseType,
  OrderChannelEnum,
  OrderStatusEnum,
  SkiAndSnowboardLevelEnum,
} from "src/constants/enums";

export class CreateOrderRequestDTO {
  @IsString()
  type: CourseType;

  @IsUUID()
  departmentId: string;

  @IsUUID()
  coursePlanId: string;

  @IsNumber()
  skiType: CourseSkiType;

  @IsNumber()
  bkgType: CourseBkgType;

  @IsNumber()
  planNumber: number;

  @IsNumber()
  planType: CoursePlanTypeEnum;

  @IsNumber()
  adultCount: number;

  @IsNumber()
  childCount: number;

  @IsString()
  discountCode: string;

  @IsString()
  channel: OrderChannelEnum;

  @IsNumber()
  status: OrderStatusEnum;

  @IsOptional()
  @IsString()
  teachingLevel?: SkiAndSnowboardLevelEnum;

  @IsOptional()
  @IsString({ each: true })
  memberIds?: string[];
}
