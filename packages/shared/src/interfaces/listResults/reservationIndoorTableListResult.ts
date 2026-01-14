import { ListResultI } from "./baseResult";
import { SkiAndSnowboardLevelEnum, ReservationStatusEnum } from '../../constants/enums'
export interface ReservationIndoorTableListResult extends ListResultI {
  id: string;
  departmentId: string;
  no: string;
  name: string;
  status: number;
  reservationStatus: ReservationStatusEnum;
  boardType: string;
  level: SkiAndSnowboardLevelEnum;
  instructor: string;
  number: number;
  remaining: number;
  beginTime: string;
}
