import { Expose } from "class-transformer";
import { OrderStatusEnum, CourseType, CourseSkiType, CourseBkgType, OrderChannelEnum } from "src/constants/enums";

export class GetOrderDetailResponseDTO {
  @Expose()
  id: string;

  @Expose()
  no: string;

  @Expose()
  type: CourseType;

  @Expose()
  skiType: CourseSkiType;

  @Expose()
  bkgType: CourseBkgType;

  @Expose()
  planNumber: number;

  @Expose()
  adultCount: number;

  @Expose()
  childCount: number;

  @Expose()
  channel: OrderChannelEnum;

  @Expose()
  status: OrderStatusEnum;

  @Expose()
  createdTime: Date;

  @Expose()
  expDate: Date;

  // Member information
  @Expose()
  ordererName: string;

  @Expose()
  ordererPhone: string;

  // CoursePlan information
  @Expose()
  coursePlanName: string;

  @Expose()
  coursePlanImage: string;

  @Expose()
  coursePlanDescription: string;

  // Department information
  @Expose()
  departmentName: string;
}
