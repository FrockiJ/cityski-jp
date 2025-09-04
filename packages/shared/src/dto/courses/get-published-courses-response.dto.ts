import { IsString } from "class-validator";
import { Expose } from "class-transformer";
import { CourseSkiType } from "src/constants/enums";

export class GetPublishedCoursesResponseDTO {
  @Expose()
  id: string;

  @Expose()
  no: string;

  @Expose()
  name: string;

  @Expose()
  skiType: CourseSkiType;

  @Expose()
  removalDate: string;

  @Expose()
  sequence: number;
}
