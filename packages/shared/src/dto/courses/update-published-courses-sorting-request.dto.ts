import { Type } from "class-transformer";
import { IsArray, IsNumber, IsUUID, ValidateNested } from "class-validator";

export class UpdatePublishedCoursesSortingRequestDTO {
  @IsUUID()
  departmentId: string;

  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => PublishedCoursesSorting)
  courses: PublishedCoursesSorting[];
}

export class PublishedCoursesSorting {
  @IsUUID()
  id: string;

  @IsNumber()
  sequence: number;
}
