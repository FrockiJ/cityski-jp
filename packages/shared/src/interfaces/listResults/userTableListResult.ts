import { UserRolesDepartmentsDTO } from "src/dto/users/get-users-response.dto";
import { ListResultI } from "./baseResult";

export interface UserTableListResult extends ListResultI {
  id: string;
  name: string;
  email: string;
  roles: string;
  status: boolean;
  isSuperAdmin: boolean;
  updatedTime: string;
  userRolesDepartments: UserRolesDepartmentsDTO[];
}
