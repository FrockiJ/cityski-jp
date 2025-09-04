import { IsString } from "class-validator";
import { Expose } from "class-transformer";

export class GetDepartmentsResponseDTO {
  @IsString()
  @Expose()
  id: string;

  @IsString()
  @Expose()
  name: string;

  @IsString()
  @Expose()
  address: string;

  @IsString()
  @Expose()
  phone: string;

  @IsString()
  @Expose()
  status: number;

  @IsString()
  @Expose()
  sequence: number;
}
