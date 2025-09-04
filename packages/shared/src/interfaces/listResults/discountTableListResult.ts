import { ListResultI } from "./baseResult";

export interface DiscountTableListResult extends ListResultI {
  id: string;
  status: boolean;
  statusTag: string;
  type: string;
  discount: string;
  code: string;
  note: string;
  endDate: string;
  createdTime: string;
  isUsed: boolean;
  usageLimit: string | number;
}
