import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CoursePlanResponseDTO {
  id: string;

  name: string; // plan name

  type: number; // plan type (e.g., 0, 1, 2, 3, 4)

  price: number; // price per session

  number: number; // number of sessions

  promotion: string; // promotion description

  sequence: number; // display order

  suggestion: boolean; // whether the plan is recommended

  level: number; // level of the ski course

  sessions: CoursePlanSessionResponseDTO[]; // optional sessions, required if course.bkgType is ARRANGE (2)
}

export class CoursePlanSessionResponseDTO {
  id?: string;

  no: number; // session number (1-based index)

  startTime: Date; // start time of the session

  endTime: Date; // end time of the session
}
