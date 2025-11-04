import { IsString, IsDateString, IsEnum, IsOptional } from 'class-validator';
import { SkiAndSnowboardLevel, SkiAndSnowboardLevelEnum, ReservationStatus, ReservationStatusEnum } from '../../constants/enums';

export class CreateReservationRequestDto {
  @IsString()
  departmentId: string;

  @IsDateString()
  classTime: Date;

  @IsEnum(SkiAndSnowboardLevel)
  teachingLevel: SkiAndSnowboardLevelEnum;

  @IsOptional()
  @IsString()
  instructor?: string;

  @IsOptional()
  @IsEnum(ReservationStatus)
  reservationStatus?: ReservationStatusEnum;
}