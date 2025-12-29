import { IsOptional, IsString, IsNumber } from 'class-validator';
import { Type, Expose } from 'class-transformer';
import { PaginationRequestDTO } from '../pagination/pagination-request.dto';
import {
  FilterType,
  OptionNames,
  CourseType,
  CourseSkiType,
  SkiAndSnowboardLevelEnum,
  ReservationStatusEnum,
} from '../../constants/enums';
import { Filter } from '../../decorators/filter';

export class GetReservationsRequestDto extends PaginationRequestDTO {
  @IsOptional()
  @IsString()
  @Expose()
  departmentId?: string;

  // 1. 課程類型篩選
  @Filter({
    type: FilterType.SELECT_MULTI,
    label: '課程類型',
    placeholder: '選擇',
    options: OptionNames.COURSE_TYPE,
    sequence: 1,
  })
  @IsOptional()
  @IsString()
  @Expose()
  courseType?: CourseType;

  // 2. 課程狀態篩選
  @Filter({
    type: FilterType.SELECT_MULTI,
    label: '課程狀態',
    placeholder: '選擇',
    options: OptionNames.RESERVATION_STATUS,
    sequence: 2,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Expose()
  reservationStatus?: ReservationStatusEnum;

  // 3. 板類篩選
  @Filter({
    type: FilterType.SELECT_MULTI,
    label: '板類',
    placeholder: '選擇',
    options: OptionNames.COURSE_SKI_TYPE,
    sequence: 3,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Expose()
  skiType?: CourseSkiType;

  // 4. 等級篩選
  @Filter({
    type: FilterType.SELECT_MULTI,
    label: '等級',
    placeholder: 'LV. ｜ 選擇',
    options: OptionNames.SKI_SNOWBOARD_LEVEL,
    sequence: 4,
  })
  @IsOptional()
  @IsString()
  @Expose()
  teachingLevel?: SkiAndSnowboardLevelEnum;

  // 5. 教練篩選
  @Filter({
    type: FilterType.SELECT_MULTI,
    label: '教練',
    placeholder: '選擇',
    options: OptionNames.INSTRUCTOR,
    sequence: 5,
  })
  @IsOptional()
  @IsString()
  @Expose()
  instructor?: string;

  // 6. 剩餘名額篩選
  @Filter({
    type: FilterType.TEXT,
    label: '剩餘名額',
    placeholder: '輸入數字',
    options: OptionNames.DATETIME, // TEXT type requires this
    sequence: 6,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Expose()
  remainingSlots?: number;

  // 7. 開始上課時間（起始）
  @Filter({
    type: FilterType.DATETIME,
    endDateKey: 'classTimeEnd',
    label: '開始上課時間',
    options: OptionNames.DATETIME,
    sequence: 7,
    placeholder: '選擇開始時間',
  })
  @IsOptional()
  @Expose()
  classTimeStart?: Date;

  // 8. 開始上課時間（結束）
  @Filter({
    type: FilterType.DATETIME_END,
    startDateKey: 'classTimeStart',
    label: '開始上課時間',
    options: OptionNames.DATETIME,
    sequence: 8,
    placeholder: '選擇結束時間',
  })
  @IsOptional()
  @Expose()
  classTimeEnd?: Date;

  // 關鍵字搜尋（不顯示為篩選，透過 SearchBar）
  @IsOptional()
  @IsString()
  @Expose()
  keyword?: string;
}
