import { IsOptional, IsString, IsUUID } from "class-validator";
import { DiscountStatus, FilterType, OptionNames } from "../../constants/enums";
import { Expose } from "class-transformer";
import { Filter } from "../../decorators/filter";
import { PaginationRequestDTO } from "../pagination/pagination-request.dto";

export class GetDiscountRequestDTO extends PaginationRequestDTO {
  @IsUUID()
  @Expose()
  departmentId: string;

  @IsString()
  @IsOptional()
  @Expose()
  keyword?: string;

  @Filter({
    type: FilterType.SELECT_MULTI,
    label: "狀態",
    options: OptionNames.DISCOUNT_STATUS,
    sequence: 1,
    placeholder: "選擇",
  })
  @IsOptional()
  @Expose()
  status?: string;

  @Filter({
    type: FilterType.DATETIME,
    endDateKey: "endCreatedTime",
    label: "建立日期",
    options: OptionNames.DATETIME,
    sequence: 2,
    placeholder: "選擇開始時間",
  })
  @IsOptional()
  @Expose()
  startCreatedTime?: Date;

  @Filter({
    type: FilterType.DATETIME_END,
    startDateKey: "startCreatedTime",
    label: "建立日期",
    options: OptionNames.DATETIME,
    sequence: 3,
    placeholder: "選擇結束時間",
  })
  @IsOptional()
  @Expose()
  endCreatedTime?: Date;

  @Filter({
    type: FilterType.DATETIME,
    endDateKey: "endExpireTime",
    label: "到期日期",
    options: OptionNames.DATETIME,
    sequence: 4,
    placeholder: "選擇開始時間",
  })
  @IsOptional()
  @Expose()
  startExpireTime?: Date;

  @Filter({
    type: FilterType.DATETIME_END,
    startDateKey: "startExpireTime",
    label: "到期日期",
    options: OptionNames.DATETIME,
    sequence: 5,
    placeholder: "選擇結束時間",
  })
  @IsOptional()
  @Expose()
  endExpireTime?: Date;
}
