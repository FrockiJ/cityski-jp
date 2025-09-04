import { IsArray, IsNumber, IsOptional, IsString } from "class-validator";
import { Filter } from "../../decorators/filter";
import { PaginationRequestDTO } from "../pagination/pagination-request.dto";
import { FilterType, OptionNames } from "../../constants/enums";
import { Expose, plainToClass } from "class-transformer";

export class QueryDemoDto {
  @Expose()
  @IsOptional()
  keyword?: string;

  @Expose()
  @IsString()
  id?: string;

  @Expose()
  @IsString()
  name?: string;

  @Expose()
  @IsString()
  email?: string;

  @Filter({
    type: FilterType.SELECT,
    label: "User Status",
    sequence: 19,
    options: OptionNames.USER_STATUS,
  })
  @Expose()
  @IsString()
  status?: string;

  @Expose()
  @IsString()
  createDate?: string;

  @Expose()
  @IsArray()
  roles?: string[];
}
