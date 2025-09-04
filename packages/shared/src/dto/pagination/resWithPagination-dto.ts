import {
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
} from "class-validator";
import { OrderType } from "../../constants/enums";
import { Expose, Type } from "class-transformer";

export class ResWithPaginationDTO<T> {
  @ValidateNested()
  @Expose()
  @Type(() => Object)
  data: T;

  @IsPositive()
  @Expose()
  total: number;

  @IsPositive()
  @Expose()
  page: number;

  @IsPositive()
  @Expose()
  limit: number;

  @IsPositive()
  @Expose()
  pages: number;
}
