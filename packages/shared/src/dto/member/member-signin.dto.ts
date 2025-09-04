import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class MemberSignInDTO {
  @IsEmail({}, { message: "請輸入正確的電子郵件格式" })
  @IsNotEmpty({ message: "Email 不能為空" })
  email: string;

  @IsString()
  @MinLength(8, { message: "密碼至少8個字元" })
  @IsNotEmpty({ message: "密碼不能為空" })
  password: string;
}
