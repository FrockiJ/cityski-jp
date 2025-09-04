import { Type } from "class-transformer";
import {
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from "class-validator";

export class MemberSignInResponseDTO {
  @ValidateNested()
  @Type(() => MemberDto)
  userInfo: MemberDto;

  @IsString()
  accessToken: string;

  @IsString()
  refreshToken: string;

  @IsNumber()
  expiresIn: number;

  @IsNumber()
  refreshExpiresIn: number;
}

export class MemberDto {
  @IsUUID()
  id: string;

  @IsString()
  no: string;

  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  lineId?: string;

  @IsString()
  @IsOptional()
  lineName?: string;

  @IsString()
  @IsOptional()
  lineOa?: string;

  @IsString()
  @IsOptional()
  avatar?: string;

  @IsString()
  type: string; // E: Email, L: Line

  @IsString()
  @IsOptional()
  phone?: string;

  @IsNumber()
  snowboard: number;

  @IsNumber()
  skis: number;

  @IsDate()
  @IsOptional()
  birthday?: Date;

  @IsString()
  @IsOptional()
  note?: string;

  @IsString()
  status: number;
}
