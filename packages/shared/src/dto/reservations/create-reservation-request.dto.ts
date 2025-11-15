import { IsString, IsDateString, IsEnum, IsOptional, IsUUID, IsArray, ArrayMinSize } from 'class-validator';
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

  @IsUUID()
  orderId: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsUUID('4', { each: true })
  orderMemberIds: string[];
}