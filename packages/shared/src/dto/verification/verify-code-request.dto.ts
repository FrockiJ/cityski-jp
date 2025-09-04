import { IsPhoneNumber, IsString } from "class-validator";

export class VerifyCodeDto {
  @IsString()
  code: string;

  @IsPhoneNumber()
  phoneNumber: string;
}
