import {
  IsArray,
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";

export class CreateRoleRequestDTO {
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
