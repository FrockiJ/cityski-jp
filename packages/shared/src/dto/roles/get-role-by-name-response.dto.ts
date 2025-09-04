import { IsNumber, IsString, IsUUID } from "class-validator";

export class GetRoleByNameResponseDTO {
  @IsUUID()
  id: string;

  @IsString()
  name: string;

  @IsNumber()
  superAdm: number;

  @IsNumber()
  status: number;
}
