import { Expose, Transform, Type } from "class-transformer";
import { PaginationRequestDTO } from "../pagination/pagination-request.dto";
import { Filter } from "../../decorators/filter";
import { IsOptional, IsUUID, IsNumber, Min } from "class-validator";
import { FilterType, OptionNames, CourseType, CourseBkgType } from "../../constants/enums";

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

  // 1. 課程類型篩選
  @Filter({
    type: FilterType.SELECT_MULTI,
    label: '課程類型',
    placeholder: '選擇',
    options: OptionNames.COURSE_TYPE,
    sequence: 1,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (!value) return undefined;
    return Array.isArray(value) ? value : [value];
  })
  @Expose()
  courseType?: CourseType | CourseType[];

  // 2. 課程預約形式篩選
  @Filter({
    type: FilterType.SELECT_MULTI,
    label: '課程預約形式',
    placeholder: '選擇',
    options: OptionNames.COURSE_BOOKING_TYPE,
    sequence: 2,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (!value) return undefined;
    const arr = Array.isArray(value) ? value : [value];
    return arr.map(v => Number(v));
  })
  @Type(() => Number)
  @Expose()
  bkgType?: CourseBkgType | CourseBkgType[];

  // 3. 訂購時間（起始）
  @Filter({
    type: FilterType.DATETIME,
    endDateKey: 'orderTimeEnd',
    label: '訂購時間',
    options: OptionNames.DATETIME,
    sequence: 3,
    placeholder: '選擇開始時間',
  })
  @IsOptional()
  @Expose()
  orderTimeStart?: Date;

  // 4. 訂購時間（結束）
  @Filter({
    type: FilterType.DATETIME_END,
    startDateKey: 'orderTimeStart',
    label: '訂購時間',
    options: OptionNames.DATETIME,
    sequence: 4,
    placeholder: '選擇結束時間',
  })
  @IsOptional()
  @Expose()
  orderTimeEnd?: Date;

  // 5. 進階篩選
  @Filter({
    type: FilterType.CHECKBOX,
    label: '進階篩選',
    options: OptionNames.ORDER_ADVANCED_FILTER,
    sequence: 5,
  })
  @IsOptional()
  @Transform(({ value }) => {
    // FilterCheckbox 會傳送選中的選項陣列，例如: [{label: '...', value: 'paidButNotReserved'}, ...]
    // 我們需要提取 value 值成為字串陣列
    if (!value) return undefined;
    if (Array.isArray(value)) {
      return value.map(item => {
        if (typeof item === 'object' && item.value) {
          return item.value;
        }
        return item;
      });
    }
    return [value];
  })
  @Expose()
  advancedFilters?: string[];
}
