import { IsOptional, IsString, IsNumber, IsEnum } from 'class-validator';
import { SkiAndSnowboardLevelEnum } from '../../constants/enums';

export class GetReservationsRequestDto {
  @IsOptional()
  @IsString()
  departmentId?: string;

  @IsOptional()
  @IsNumber()
  reservationStatus?: number;

  @IsOptional()
  @IsString()
  keyword?: string;

  @IsOptional()
  @IsNumber()
  page?: number;

  @IsOptional()
  @IsNumber()
  limit?: number;
}