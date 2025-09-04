import { Exclude } from "class-transformer";
import {
  IsArray,
  IsDate,
  IsEmail,
  IsNumber,
  IsObject,
  IsString,
  IsUUID,
} from "class-validator";

export class GetUsersResponseDTO {
  @IsUUID()
  id: string;

  @IsString()
  name: string;

  @IsString()
  isSuperAdmin: boolean;

  @IsEmail()
  email: string;

  @IsNumber()
  status: number;

  @IsDate()
  updatedTime: Date;

  @IsArray()
  userRolesDepartments: UserRolesDepartmentsDTO[];

  @Exclude()
  password: string;

  @Exclude()
  refresh: string | null;
}

export class Role {
  @IsUUID()
  id: string;

  @IsString()
  name: string;

  @IsNumber()
  superAdm: number;

  @IsNumber()
  status: number;
}

export class Department {
  @IsUUID()
  id: string;

  @IsString()
  name: string;

  @IsString()
  address: string;

  @IsString()
  phone: string;

  @IsNumber()
  status: number;
}

export class UserRolesDepartmentsDTO {
  @IsUUID()
  id: string;

  @IsObject()
  role: Role;

  @IsObject()
  department: Department;
}
