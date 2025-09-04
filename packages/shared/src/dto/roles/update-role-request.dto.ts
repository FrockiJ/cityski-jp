import {
  IsArray,
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";

export class UpdateRoleRequestDTO {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsArray()
  menuIds: string[];

  @IsNumber()
  @IsOptional()
  status?: number;

  @IsNumber()
  @IsOptional()
  superAdm?: number;
}
