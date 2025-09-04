import { Type } from "class-transformer";
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from "class-validator";
import {
  CourseDayUnit,
  CourseInfoType,
  CoursePaxLimitType,
  CoursePeopleType,
  CourseReleaseType,
  CourseRemovalType,
  CourseSkiType,
  CourseStatusType,
  CourseTeachingType,
  CourseType,
  CourseBkgType,
  CourseCancelPolicyTypeEnum,
} from "src/constants/enums";
import { AttachmentRequestDTO } from "../files/attachment-request-dto";
import { CreateCoursePlanRequestDto } from "../course-plans/create-course-plan-request.dto";

export class CreateCourseRequestDTO {
  @IsUUID()
  departmentId: string;

  @IsString()
  type: CourseType;

  @IsNumber()
  teachingType: CourseTeachingType;

  @IsNumber()
  status: CourseStatusType;

  @IsString()
  name: string;

  @IsNumber()
  skiType: CourseSkiType;

  @IsString()
  description: string;

  @IsString()
  explanation: string;

  @IsString()
  @IsOptional()
  promotion?: string;

  @IsNumber()
  bkgType: CourseBkgType;

  @IsNumber()
  length: number;

  @IsNumber()
  bkgStartDay: number;

  @IsOptional()
  @IsString()
  bkgLatestDayUnit: CourseDayUnit | null;

  @IsOptional()
  @IsNumber()
  bkgLatestDay: number | null;

  @IsString()
  paxLimitType: CoursePaxLimitType;

  @IsString()
  releaseType: CourseReleaseType;

  @IsString()
  releaseDate: string;

  @IsString()
  removalType: CourseRemovalType;

  @IsString()
  removalDate: string;

  // @IsString()
  // actualRemovalDate: string;

  @IsNumber()
  checkBefDay: number;

  @IsBoolean()
  cancelable: boolean;

  @IsNumber()
  sequence: number;

  // course people
  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => CoursePeople)
  coursePeople: CoursePeople[];

  // course info
  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => CourseInfo)
  courseInfos: CourseInfo[];

  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => CourseCancelPolicyDTO)
  courseCancelPolicies: CourseCancelPolicyDTO[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateCoursePlanRequestDto)
  coursePlans: CreateCoursePlanRequestDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AttachmentRequestDTO)
  attachments: AttachmentRequestDTO[];
}

export class CoursePeople {
  @IsString()
  @IsOptional()
  id?: string;

  @IsNumber()
  type: CoursePeopleType;

  @IsNumber()
  minPeople: number;

  @IsNumber()
  maxPeople: number;

  @IsNumber()
  @IsOptional()
  basePeople?: number;

  @IsNumber()
  @IsOptional()
  addPrice?: number;
}

export class CourseInfo {
  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  type: CourseInfoType;

  @IsString()
  explanation: string;

  @IsNumber()
  sequence: number;
}

export class CourseCancelPolicyDTO {
  @IsString()
  @IsOptional()
  id?: string;

  @IsNumber()
  type: CourseCancelPolicyTypeEnum;

  @IsNumber()
  beforeDay: number;

  @IsOptional()
  @IsNumber()
  withinDay?: number;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsNumber()
  sequence: number;
}
