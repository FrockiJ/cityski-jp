import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateDepartmentDTO {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  parentId?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  status?: number;
}
