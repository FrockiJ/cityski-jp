import { Expose } from "class-transformer";
import { OrderStatusEnum } from "src/constants/enums";

export class GetOrdersResponseDTO {
  @Expose()
  id: string;

  @Expose()
  courseName: string;

  @Expose()
  price: number;

  @Expose()
  status: OrderStatusEnum;

  // todo enum
  @Expose()
  paymentStatus: number;

  @Expose()
  number: number;

  @Expose()
  people: number;

  @Expose()
  process: number;

  @Expose()
  createdTime: Date;
}
