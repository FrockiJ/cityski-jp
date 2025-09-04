import {
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  Matches,
} from "class-validator";
import { OrderType } from "../../constants/enums";
import { Transform } from "class-transformer";

export class PaginationRequestDTO {
  // pagination start
  @IsPositive()
  @IsOptional()
  @Transform(({ value }) => Number(value))
  page?: number;

  @IsPositive()
  @IsOptional()
  @Transform(({ value }) => Number(value))
  limit?: number;
  // pagination end

  // sorting start
  @IsOptional()
  sort?: string;

  @IsOptional()
  order?: OrderType;
  // sorting end

  // filter start
  // @Matches(/^\d{4}-\d{2}-\d{2}$/, {
  //   message: "startUpdatedTime日期格式為YYYY-MM-DD",
  // })
  // @IsOptional()
  // startUpdatedTime?: Date;

  // @Matches(/^\d{4}-\d{2}-\d{2}$/, {
  //   message: "endUpdatedTime日期格式為YYYY-MM-DD",
  // })
  // @IsOptional()
  // endUpdatedTime?: Date;

  // @IsString()
  // @IsOptional()
  // search?: string;

  // @IsString()
  // @IsOptional()
  // role?: string;
  // filter end
}
