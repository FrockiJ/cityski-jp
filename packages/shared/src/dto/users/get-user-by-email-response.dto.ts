import { Expose } from "class-transformer";
import { IsEmail, IsNumber, IsString, IsUUID } from "class-validator";

export class GetUserByEmailResponseDTO {
  @IsUUID()
  @Expose()
  id: string;

  @IsString()
  @Expose()
  name: string;

  @IsEmail()
  @Expose()
  email: string;

  @IsNumber()
  @Expose()
  status: number;

  @IsString()
  @Expose()
  isDefPassword: string;
}
