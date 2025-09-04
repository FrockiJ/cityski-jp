import { IsPhoneNumber } from "class-validator";

export class SendVerificationCodeDto {
  @IsPhoneNumber()
  phoneNumber: string;
}
