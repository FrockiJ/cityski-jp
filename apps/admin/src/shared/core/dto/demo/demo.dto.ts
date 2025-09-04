import {
  HostPermission,
  OauthProvider,
  UserRole,
  UserStatus,
} from "../../constants";

export class DemoDto {
  id!: string;

  email!: string; // email

  firstName!: string;

  lastName!: string;

  address?: string;

  city?: string;

  zipCode?: string;

  country?: string;

  phone?: string;

  description?: string;

  profileImage?: string;

  role!: UserRole; // 帳號角色

  status!: UserStatus; // 帳號狀態

  hostPermission!: HostPermission; // 帳號角色

  refreshToken!: string;

  providerId?: string;

  provider?: OauthProvider;

  createDate!: Date;

  updateDate!: Date;
}
