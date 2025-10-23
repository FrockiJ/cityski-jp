import { ListResultI } from "./baseResult";
import { SkiAndSnowboardLevelEnum } from '@repo/shared'
export interface ReservationIndoorTableListResult extends ListResultI {
  id: string;
  no: string;
  name: string;
  status: number;
  boardType: string;
  level: SkiAndSnowboardLevelEnum;
  instructor: string;
  number: number;
  remaining: number;
  beginTime: string;
}
