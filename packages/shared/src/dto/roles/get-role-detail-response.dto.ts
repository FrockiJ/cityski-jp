import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsString,
  IsUUID,
} from "class-validator";
import { IsSuperAdmin, RoleStatus } from "../../constants/enums";

export class GetRoleDetailResponseDTO {
  @IsUUID()
  id: string;

  @IsString()
  name: string;

  @IsNumber()
  superAdm: IsSuperAdmin;

  @IsBoolean()
  status: RoleStatus;

  @IsArray()
  menuIds: string[];
}
