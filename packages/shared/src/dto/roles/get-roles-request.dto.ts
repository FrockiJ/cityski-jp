import { IsOptional, IsString } from "class-validator";
import { FilterType, OptionNames } from "../../constants/enums";
import { PaginationRequestDTO } from "../pagination/pagination-request.dto";
import { Filter } from "../../decorators/filter";
import { Expose } from "class-transformer";

export class GetRolesRequestDTO extends PaginationRequestDTO {
  @IsString()
  @IsOptional()
  @Expose()
  keyword?: string;

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
