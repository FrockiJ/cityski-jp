import { IsString, IsDateString, IsEnum, IsOptional } from 'class-validator';
import { SkiAndSnowboardLevel, SkiAndSnowboardLevelEnum } from '../../constants/enums';

export class UpdateReservationRequestDto {
  @IsOptional()
  @IsString()
  departmentId?: string;

  @IsOptional()
  @IsDateString()
  classTime?: Date;

  @IsOptional()
  @IsEnum(SkiAndSnowboardLevel)
  teachingLevel?: SkiAndSnowboardLevelEnum;

  @IsOptional()
  @IsString()
  instructor?: string;

  @IsOptional()
  @IsString()
  reservationStatus?: string;
}
