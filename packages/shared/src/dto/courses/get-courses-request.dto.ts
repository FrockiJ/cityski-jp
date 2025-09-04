import { Expose } from "class-transformer";
import { IsNumber, IsOptional, IsString, IsUUID } from "class-validator";
import {
  CourseBkgType,
  CourseStatusType,
  CourseType,
  FilterType,
  OptionNames,
} from "../../constants/enums";
import { Filter } from "../../decorators/filter";
import { PaginationRequestDTO } from "../pagination/pagination-request.dto";

export class GetCoursesRequestDTO extends PaginationRequestDTO {
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
    placeholder: "選擇",
    options: OptionNames.COURSE_STATUS,
    sequence: 1,
  })
  @IsString()
  @IsOptional()
  @Expose()
  status?: CourseStatusType;

  @Filter({
    type: FilterType.SELECT_MULTI,
    label: "類型",
    placeholder: "選擇",
    options: OptionNames.COURSE_TYPE,
    sequence: 2,
  })
  @IsString()
  @IsOptional()
  @Expose()
  type?: CourseType;

  @Filter({
    type: FilterType.SELECT_MULTI,
    label: "課程預約形式",
    placeholder: "選擇",
    options: OptionNames.COURSE_BOOKING_TYPE,
    sequence: 3,
  })
  @IsString()
  @IsOptional()
  @Expose()
  bkgType?: CourseBkgType;

  @Filter({
    type: FilterType.DATETIME,
    endDateKey: "endReleaseDate",
    label: "課程上架時間",
    options: OptionNames.DATETIME,
    sequence: 4,
    placeholder: "選擇開始時間",
  })
  @IsOptional()
  @Expose()
  startReleaseDate?: Date;

  @Filter({
    type: FilterType.DATETIME_END,
    startDateKey: "startReleaseDate",
    label: "課程上架時間",
    options: OptionNames.DATETIME,
    sequence: 5,
    placeholder: "選擇結束時間",
  })
  @IsOptional()
  @Expose()
  endReleaseDate?: Date;

  @Filter({
    type: FilterType.DATETIME,
    endDateKey: "endRemovalDate",
    label: "課程下架時間",
    options: OptionNames.DATETIME,
    sequence: 6,
    placeholder: "選擇開始時間",
  })
  @IsOptional()
  @Expose()
  startRemovalDate?: Date;

  @Filter({
    type: FilterType.DATETIME_END,
    startDateKey: "startRemovalDate",
    label: "課程下架時間",
    options: OptionNames.DATETIME,
    sequence: 7,
    placeholder: "選擇結束時間",
  })
  @IsOptional()
  @Expose()
  endRemovalDate?: Date;

  @Filter({
    type: FilterType.DATETIME,
    endDateKey: "endUpdatedTime",
    label: "最後編輯時間",
    options: OptionNames.DATETIME,
    sequence: 8,
    placeholder: "選擇開始時間",
  })
  @IsOptional()
  @Expose()
  startUpdatedTime?: Date;

  @Filter({
    type: FilterType.DATETIME_END,
    startDateKey: "startUpdatedTime",
    label: "最後編輯時間",
    options: OptionNames.DATETIME,
    sequence: 9,
    placeholder: "選擇結束時間",
  })
  @IsOptional()
  @Expose()
  endUpdatedTime?: Date;
}
