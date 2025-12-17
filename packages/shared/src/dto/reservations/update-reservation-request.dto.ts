import { IsString, IsDateString, IsEnum, IsOptional, IsBoolean } from 'class-validator';
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
  @IsBoolean()
  isDesignatedCoach?: boolean;

  @IsOptional()
  @IsEnum(ReservationStatus)
  reservationStatus?: ReservationStatusEnum;

  @IsOptional()
  @IsString()
  reason?: string;
}
