import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from "class-validator";

export class CreateUserRequestDTO {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsNumber()
  @IsOptional()
  status?: number;

  @IsString()
  @IsOptional()
  isDefPassword?: string;

  @IsString()
  @IsOptional()
  createdUser?: string;

  // @IsDate()
  // @IsOptional()
  // createdDate?: Date;

  @IsString()
  @IsOptional()
  updatedUser?: string;

  // @IsDate()
  // @IsOptional()
  // updatedDate?: Date;

  // @IsNotEmpty()
  // @IsArray()
  // departmentIds: string[];

  // @IsNotEmpty()
  // @IsArray()
  // roleIds: string[];
  @IsNotEmpty()
  @IsArray()
  departmentsWithRoles: DepartmentRoleDTO[];
}

// 用於部門和角色的 DTO
class DepartmentRoleDTO {
  @IsUUID()
  departmentId: string;

  @IsUUID()
  roleId: string;
}
