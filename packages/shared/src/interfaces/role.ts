import { NavIconName } from "../constants/enums";

export type NavWithPermissionModel = {
  id: string;
  pageName: string;
  path: string;
  icon?: NavIconName;
  permissions: {
    view: boolean;
    edit: boolean;
  };
  subPages: NavWithPermissionModel[];
};
