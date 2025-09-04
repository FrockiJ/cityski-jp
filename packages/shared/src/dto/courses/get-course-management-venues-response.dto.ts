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

export class GetCourseManagementVenuesResponseDTO {
  id: string;

  departmentId: string;

  group: boolean;

  private: boolean;

  individual: boolean;

  name: string;
}
