import { ListResultI } from "./baseResult";

export interface CourseTableListResult extends ListResultI {
  no: string;
  name: string;
  status: string;
  type: string;
  bkgType: string;
  releaseDate: string;
  removalDate: string;
  updatedTime: string;
}
