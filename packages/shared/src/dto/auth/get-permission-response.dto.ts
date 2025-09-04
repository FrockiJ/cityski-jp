import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from "class-validator";
import {
  Department,
  UserRolesDepartmentsDTO,
} from "../users/get-users-response.dto";
import { Type } from "class-transformer";

export class UserInfoDTO {
  @IsUUID()
  id: string;

  @IsUUID()
  userPermissionId: string;

  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsNumber()
  status: number;

  @IsString()
  isDefPassword: string;

  @IsBoolean()
  isSuperAdmin: boolean;

  @IsObject()
  userRolesDepartments: UserRolesDepartmentsDTO;
}

export class MenuDTO {
  @IsUUID()
  id: string;

  @IsString()
  groupName: string;

  @IsString()
  name: string;

  @IsString()
  path: string;

  @IsNumber()
  sequence: number;

  @IsNumber()
  @IsOptional()
  subPages?: MenuDTO[];

  @IsNumber()
  status: number;

  @IsString()
  icon: number;
}

export class GetPermissionResponseDTO {
  @ValidateNested()
  userInfo: UserInfoDTO;

  @ValidateNested()
  @IsArray()
  @Type(() => MenuDTO)
  menus: MenuDTO[];

  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => Department)
  departments: Department[];
}
