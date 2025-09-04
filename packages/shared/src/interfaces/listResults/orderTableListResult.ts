import { ListResultI } from "./baseResult";

export interface OrderTableListResult extends ListResultI {
  id: string;
  no: string;
  name: string;
  amount: number;
  status: boolean;
  payStatus: string;
  lessons: number;
  beginTime: string;
  people: number;
  progress: string;
  orderTime: string;
}
