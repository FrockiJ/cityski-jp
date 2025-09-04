import { ListResultI } from "./baseResult";

export interface RoleTableListResult extends ListResultI {
  id: string;
  name: string;
  usageCount: number;
  status: boolean;
  superAdm: boolean;
  disabled: boolean;
  updatedTime: string;
}
