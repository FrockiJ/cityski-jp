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
} from "src/constants/enums";
import { AttachmentRequestDTO } from "../files/attachment-request-dto";
import {
  CourseCancelPolicyDTO,
  CourseInfo,
  CoursePeople,
} from "./create-course-request.dto";
import { CreateCoursePlanRequestDto } from "../course-plans/create-course-plan-request.dto";

export class UpdateCourseRequestDTO {
  @IsUUID()
  departmentId: string;

  @IsUUID()
  id: string;

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
  @ValidateNested()
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
