import { IsNumber, IsObject, IsString } from "class-validator";
import { Department } from "../users/get-users-response.dto";

export class SignInResponseDTO {
  @IsString()
  accessToken: string;

  @IsString()
  refreshToken: string;

  @IsNumber()
  expiresIn: number;

  @IsNumber()
  refreshExpiresIn: number;

  @IsObject()
  departments: Department[];
}
