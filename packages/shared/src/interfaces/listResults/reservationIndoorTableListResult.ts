import { ListResultI } from "./baseResult";

export interface ReservationIndoorTableListResult extends ListResultI {
  id: string;
  no: string;
  name: string;
  status: boolean;
  boardType: string;
  level: string;
  instructor: string;
  number: number;
  remaining: number;
  beginTime: string;
}
