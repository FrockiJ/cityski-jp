import { IsString, IsDateString, IsEnum, IsOptional } from 'class-validator';
import { SkiAndSnowboardLevel, SkiAndSnowboardLevelEnum} from '../../constants/enums';

export class CreateReservationRequestDto {
  @IsString()
  departmentId: string;

  @IsDateString()
  classTime: Date;

  @IsEnum(SkiAndSnowboardLevel)
  teachingLevel: SkiAndSnowboardLevelEnum;

  @IsOptional()
  @IsString()
  designatedCoach?: string;

  @IsOptional()
  @IsString()
  reservationStatus?: string;
}