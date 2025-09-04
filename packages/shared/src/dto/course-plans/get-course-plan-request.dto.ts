import { IsNotEmpty, IsUUID } from "class-validator";

export class GetCoursePlanRequestDto {
  @IsUUID()
  @IsNotEmpty({ message: "Course ID is required." })
  courseId: string;
}
