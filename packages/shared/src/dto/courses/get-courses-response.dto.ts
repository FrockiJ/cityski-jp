import { Expose } from "class-transformer";
import {
  CourseBkgType,
  CourseStatusType,
  CourseType,
} from "src/constants/enums";

export class GetCoursesResponseDTO {
  @Expose()
  id: string;

  @Expose()
  no: string;

  @Expose()
  name: string;

  @Expose()
  status: CourseStatusType;

  @Expose()
  type: CourseType;

  @Expose()
  bkgType: CourseBkgType;

  @Expose()
  releaseDate: string;

  @Expose()
  removalDate: string;

  @Expose()
  updatedTime: string;
}
