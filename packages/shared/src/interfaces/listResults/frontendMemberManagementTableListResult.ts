import { ListResultI } from "./baseResult";

export interface FrontendMemberManagementTableListResult extends ListResultI {
  id: string;
  no: string;
  name: string;
  phone: string;
  snowboard: string;
  skis: string;
  email: string;
  type: string;
  birthday: string;
  status: boolean;
  createTime: string;
}
