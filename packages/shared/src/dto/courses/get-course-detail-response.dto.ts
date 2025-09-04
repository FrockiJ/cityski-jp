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
import { CoursePlanResponseDTO } from "../course-plans/course-plan-response.dto";

export class GetCourseDetailResponseDTO {
  id: string;

  departmentId: string;

  no: string;

  type: CourseType;

  teachingType: CourseTeachingType;

  status: CourseStatusType;

  name: string;

  skiType: CourseSkiType;

  description: string;

  explanation: string;

  promotion: string;

  bkgType: CourseBkgType;

  length: number;

  bkgStartDay: number;

  bkgLatestDayUnit: CourseDayUnit;

  bkgLatestDay: number;

  paxLimitType: CoursePaxLimitType;

  releaseType: CourseReleaseType;

  releaseDate: string;

  removalType: CourseRemovalType;

  removalDate: string;

  actualRemovalDate: string;

  checkBefDay: number;

  cancelable: boolean;

  sequence: number;

  coursePeople: CoursePeople[];

  courseInfos: CourseInfo[];

  coursePlans: CoursePlanResponseDTO[];

  courseCancelPolicies: CourseCancelPolicyDTO[];

  attachments: AttachmentRequestDTO[];
}
