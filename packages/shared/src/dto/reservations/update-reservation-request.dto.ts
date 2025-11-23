import { IsString, IsDateString, IsEnum, IsOptional } from 'class-validator';
import { SkiAndSnowboardLevel, SkiAndSnowboardLevelEnum, ReservationStatus, ReservationStatusEnum } from '../../constants/enums';

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
  @IsEnum(ReservationStatus)
  reservationStatus?: ReservationStatusEnum;

  @IsOptional()
  @IsString()
  reason?: string;
}
