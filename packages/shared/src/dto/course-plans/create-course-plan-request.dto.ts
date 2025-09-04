import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsInt,
  Min,
  IsBoolean,
  IsUUID,
  ValidateNested,
  Max,
  IsArray,
  IsNumber,
} from "class-validator";
import { Type } from "class-transformer";
import { CreateCoursePlanSessionRequestDto } from "./create-course-plan-session-request.dto";

export class CreateCoursePlanRequestDto {
  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  @IsNotEmpty({ message: "Plan name is required." })
  name: string; // plan name

  @IsInt({ message: "Plan type must be an integer" })
  @Min(0, { message: "Plan type must be 0, 1, 2, 3 or 4" })
  @Max(4, { message: "Plan type must be 0, 1, 2, 3 or 4" })
  @IsOptional()
  type?: number; // plan type (e.g., 0, 1, 2, 3, 4)

  @IsInt()
  @Min(0, { message: "Price must be a non-negative number." })
  @IsOptional()
  price?: number; // price per session

  @IsInt()
  @Min(1, { message: "Number of sessions must be at least 1." })
  @IsOptional()
  number?: number; // number of sessions

  @IsString()
  @IsOptional()
  promotion?: string; // promotion description

  @IsInt()
  @Min(0, { message: "Sequence must be a non-negative number." })
  @IsNotEmpty({ message: "Sequence is required." })
  sequence: number; // display order

  @IsBoolean()
  @IsOptional()
  suggestion?: boolean; // whether the plan is recommended

  @IsNumber()
  @IsOptional()
  level?: number; // ski course level

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateCoursePlanSessionRequestDto)
  @IsOptional()
  sessions?: CreateCoursePlanSessionRequestDto[]; // optional sessions, required if course.bkgType is ARRANGE (2)
}
