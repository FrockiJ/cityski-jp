import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from "class-validator";

export class UpdateUserRequestDTO {
  @IsString()
  @IsUUID()
  id: string;

  @IsString()
  name: string;

  @IsNumber()
  status: number;

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
