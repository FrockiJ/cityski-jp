import { IsOptional, IsString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationRequestDTO } from '../pagination/pagination-request.dto';

export class GetReservationsRequestDto extends PaginationRequestDTO {
  @IsOptional()
  @IsString()
  departmentId?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  reservationStatus?: number;

  @IsOptional()
  @IsString()
  keyword?: string;
}