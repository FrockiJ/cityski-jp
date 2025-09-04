import { HomeAreaType } from "src/constants/enums";
import { ListResultI } from "./baseResult";

export interface CmsTableListResult extends ListResultI {
  id: string;
  homeAreaType: HomeAreaType;
  homeAreaTitle: string;
  updatedUser: string;
  updatedTime: string;
}
