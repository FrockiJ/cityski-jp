import { Expose, Transform, Type } from "class-transformer";
import { PaginationRequestDTO } from "../pagination/pagination-request.dto";
import { Filter } from "../../decorators/filter";
import { IsOptional, IsUUID, IsNumber, Min } from "class-validator";
import { FilterType, OptionNames } from "../../constants/enums";

export class GetOrdersRequestDTO extends PaginationRequestDTO {
  @IsUUID()
  @Expose()
  departmentId: string;

  @IsOptional()
  @Expose()
  keyword?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'status must be a valid number' })
  @Min(0, { message: 'status must be greater than or equal to 0' })
  @Expose()
  status?: number;

  @Filter({
    type: FilterType.DATETIME,
    endDateKey: "endUpdatedTime",
    label: "修改日期",
    options: OptionNames.DATETIME,
    sequence: 1,
    placeholder: "選擇開始時間",
  })
  @IsOptional()
  @Expose()
  startUpdatedTime?: Date;

  @Filter({
    type: FilterType.DATETIME_END,
    startDateKey: "startUpdatedTime",
    label: "修改日期",
    options: OptionNames.DATETIME,
    sequence: 2,
    placeholder: "選擇結束時間",
  })
  @IsOptional()
  @Expose()
  endUpdatedTime?: Date;
}
