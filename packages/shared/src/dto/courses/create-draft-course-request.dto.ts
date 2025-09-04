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

export class CreateDraftCourseRequestDTO {
  @IsUUID()
  departmentId: string;

  @IsString()
  type: CourseType;

  @IsNumber()
  @IsOptional()
  teachingType?: CourseTeachingType | null;

  @IsNumber()
  status: CourseStatusType;

  @IsString()
  name: string;

  @IsNumber()
  @IsOptional()
  skiType?: CourseSkiType | null;

  @IsString()
  @IsOptional()
  description?: string | null;

  @IsString()
  @IsOptional()
  explanation?: string | null;

  @IsString()
  @IsOptional()
  promotion?: string | null;

  @IsNumber()
  @IsOptional()
  bkgType?: CourseBkgType | null;

  @IsNumber()
  @IsOptional()
  length?: number | null;

  @IsNumber()
  @IsOptional()
  bkgStartDay?: number | null;

  @IsString()
  @IsOptional()
  bkgLatestDayUnit?: CourseDayUnit | null;

  @IsNumber()
  @IsOptional()
  bkgLatestDay?: number | null;

  @IsString()
  @IsOptional()
  paxLimitType?: CoursePaxLimitType | null;

  @IsString()
  @IsOptional()
  releaseType?: CourseReleaseType | null;

  @IsString()
  @IsOptional()
  releaseDate?: string | null;

  @IsString()
  @IsOptional()
  removalType?: CourseRemovalType | null;

  @IsString()
  @IsOptional()
  removalDate?: string | null;

  // @IsString()
  // @IsOptional()
  // actualRemovalDate?: string;

  @IsNumber()
  @IsOptional()
  checkBefDay?: number | null;

  @IsBoolean()
  @IsOptional()
  cancelable?: boolean | null;

  @IsNumber()
  @IsOptional()
  sequence?: number | null;

  // course people
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => DraftCoursePeople)
  coursePeople?: DraftCoursePeople[] | null;

  // course info
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DraftCourseInfo)
  courseInfos?: DraftCourseInfo[] | null;

  @IsOptional()
  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => DraftCourseCancelPolicyDTO)
  courseCancelPolicies?: DraftCourseCancelPolicyDTO[] | null;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateCoursePlanRequestDto)
  coursePlans?: CreateCoursePlanRequestDto[] | null;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AttachmentRequestDTO)
  attachments?: AttachmentRequestDTO[] | null;
}

export class DraftCoursePeople {
  @IsString()
  @IsOptional()
  id?: string;

  @IsNumber()
  @IsOptional()
  type?: CoursePeopleType | null;

  @IsNumber()
  @IsOptional()
  minPeople?: number | null;

  @IsNumber()
  @IsOptional()
  maxPeople?: number | null;

  @IsNumber()
  @IsOptional()
  basePeople?: number | null;

  @IsNumber()
  @IsOptional()
  addPrice?: number | null;
}

export class DraftCourseInfo {
  @IsString()
  @IsOptional()
  id?: string | null;

  @IsString()
  @IsOptional()
  type?: CourseInfoType | null;

  @IsString()
  @IsOptional()
  explanation?: string | null;

  @IsNumber()
  @IsOptional()
  sequence?: number | null;
}

export class DraftCourseCancelPolicyDTO {
  @IsString()
  @IsOptional()
  id?: string;

  @IsOptional()
  @IsNumber()
  type?: CourseCancelPolicyTypeEnum | null;

  @IsOptional()
  @IsNumber()
  beforeDay?: number | null;

  @IsOptional()
  @IsNumber()
  withinDay?: number | null;

  @IsOptional()
  @IsNumber()
  price?: number | null;

  @IsOptional()
  @IsNumber()
  sequence?: number | null;
}
