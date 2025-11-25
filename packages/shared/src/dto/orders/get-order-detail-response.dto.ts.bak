import { Expose, Type } from "class-transformer";
import { OrderStatusEnum, CourseType, CourseSkiType, CourseBkgType, OrderChannelEnum } from "src/constants/enums";
import { OrderInvitationResponseDto } from "../order-invitations/order-invitation-response.dto";
export  class OrderMemberDetailDTO {
        id: string;
        memberId: string;
        memberName: string;
        memberPhone: string;
        memberBirthday: Date;
        snowboard: number;
        skis: number;
        avatar: string;
        orderNo: string;
        active: boolean;
        discountId?: string;
    }
export class GetOrderDetailResponseDTO {
  @Expose()
  id: string;

  @Expose()
  no: string;

  @Expose()
  courseId: string;

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
  coursePlanId: string;

  @Expose()
  coursePlanName: string;

  @Expose()
  coursePlanImage: string;

  @Expose()
  coursePlanDescription: string;

  // Department information
  @Expose()
  departmentName: string;

  // Order members information
  @Expose()
  orderMembers: Array<OrderMemberDetailDTO>;

  @Expose()
  discountId: string;

  // Pending invitations
  @Expose()
  @Type(() => OrderInvitationResponseDto)
  pendingInvitations?: OrderInvitationResponseDto[];
}
