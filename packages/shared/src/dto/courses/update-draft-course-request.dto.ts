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
  CoursePaxLimitType,
  CourseReleaseType,
  CourseRemovalType,
  CourseSkiType,
  CourseStatusType,
  CourseTeachingType,
  CourseType,
  CourseBkgType,
} from "src/constants/enums";
import { AttachmentRequestDTO } from "../files/attachment-request-dto";
import {
  DraftCourseCancelPolicyDTO,
  DraftCourseInfo,
  DraftCoursePeople,
} from "./create-draft-course-request.dto";
import { CreateCoursePlanRequestDto } from "../course-plans/create-course-plan-request.dto";

export class UpdateDraftCourseRequestDTO {
  @IsUUID()
  departmentId: string;

  @IsUUID()
  id: string;

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
  @ValidateNested()
  @Type(() => DraftCoursePeople)
  coursePeople?: DraftCoursePeople[] | null;

  // course info
  @IsOptional()
  @ValidateNested({ each: true })
  @IsArray()
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
