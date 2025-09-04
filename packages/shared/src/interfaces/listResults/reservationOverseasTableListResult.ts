import { ListResultI } from "./baseResult";

export interface ReservationOverseasTableListResult extends ListResultI {
  id: string;
  no: string;
  name: string;
  snowField: string;
  status: boolean;
  boardType: string;
  instructor: string;
  remaining: number;
  beginTime: string;
}
