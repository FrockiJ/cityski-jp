import { OrderType } from "../../constants/enums";

export class PaginationRequestDto {
  page?: number;
  limit?: number;
  sort?: string;
  order?: OrderType;
}
