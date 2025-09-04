import { Type } from "class-transformer";
import { IsInt, Min, IsDate, IsString, IsOptional } from "class-validator";

export class CreateCoursePlanSessionRequestDto {
  @IsString()
  @IsOptional()
  id?: string;

  @IsInt()
  @Min(1, { message: "Session number must be at least 1." })
  no: number; // session number (1-based index)

  @IsDate({ message: "Start time must be a valid date." })
  @Type(() => Date) // transform date in string format to a date
  startTime: Date; // start time of the session

  @IsDate({ message: "End time must be a valid date." })
  @Type(() => Date) // transform date in string format to a date
  endTime: Date; // start time of the session
}
