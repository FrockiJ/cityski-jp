import { IsUUID } from "class-validator";

export class GetPermissionRequestDTO {
  @IsUUID()
  departmentId: string;
}
