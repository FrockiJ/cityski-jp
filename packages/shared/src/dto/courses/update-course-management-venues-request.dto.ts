import { Type } from "class-transformer";
import { IsBoolean, IsUUID } from "class-validator";
export class UpdateCourseManagementVenuesRequestDTO {
  @IsUUID()
  id: string;

  @IsBoolean()
  group: boolean;

  @IsBoolean()
  private: boolean;

  @IsBoolean()
  individual: boolean;
}
