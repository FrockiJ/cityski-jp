import { IsEnum, IsOptional, IsString } from "class-validator";
import {
  FilterType,
  MemberType,
  MemberTypeEnum,
  OptionNames,
} from "../../constants/enums";
import { PaginationRequestDTO } from "../pagination/pagination-request.dto";
import { Filter } from "../../decorators/filter";
import { Expose } from "class-transformer";

export class GetMembersRequestDto extends PaginationRequestDTO {
  @IsString()
  @IsOptional()
  @Expose()
  keyword?: string;

  @Filter({
    type: FilterType.TEXT,
    options: OptionNames.MEMBER_NO,
    label: "會員編號",
    sequence: 1,
    placeholder: "輸入",
  })
  @IsString()
  @IsOptional()
  @Expose()
  no?: string;

  @Filter({
    type: FilterType.TEXT,
    options: OptionNames.MEMBER_EMAIL,
    label: "Email",
    sequence: 4,
    placeholder: "輸入",
  })
  @IsString()
  @IsOptional()
  @Expose()
  email?: string;

  @Filter({
    type: FilterType.SELECT_MULTI,
    label: "雙板等級",
    options: OptionNames.MEMBER_SKIS,
    sequence: 3,
    placeholder: "選擇",
  })
  @IsOptional()
  @IsString()
  @Expose()
  skiLevel?: string;

  @Filter({
    type: FilterType.SELECT_MULTI,
    label: "單板等級",
    options: OptionNames.MEMBER_SNOWBOARD,
    sequence: 2,
    placeholder: "選擇",
  })
  @IsOptional()
  @IsString()
  @Expose()
  snowboardLevel?: string;

  @Filter({
    type: FilterType.SELECT,
    label: "註冊方式",
    options: OptionNames.MEMBER_TYPE,
    sequence: 5,
    placeholder: "選擇",
  })
  @IsOptional()
  @IsEnum(MemberType, {
    message: "memberType must be L (LINE) or E (EMAIL)",
  })
  @Expose()
  type?: MemberTypeEnum;

  @Filter({
    type: FilterType.SELECT_MULTI,
    label: "狀態",
    options: OptionNames.MEMBER_STATUS,
    sequence: 8,
    placeholder: "選擇",
    menuPlacement: "top",
  })
  @IsString()
  @IsOptional()
  @Expose()
  status?: string;

  @Filter({
    type: FilterType.DATETIME,
    endDateKey: "endUpdatedTime",
    label: "建立日期",
    options: OptionNames.DATETIME,
    sequence: 6,
    placeholder: "選擇開始時間",
  })
  @IsOptional()
  @Expose()
  startUpdatedTime?: Date;

  @Filter({
    type: FilterType.DATETIME_END,
    startDateKey: "startCreatedTime",
    label: "建立日期",
    options: OptionNames.DATETIME,
    sequence: 7,
    placeholder: "選擇結束時間",
  })
  @IsOptional()
  @Expose()
  endUpdatedTime?: Date;
}
