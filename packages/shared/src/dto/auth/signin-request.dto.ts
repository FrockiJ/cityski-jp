import { IsEmail, IsString, Length, Matches } from "class-validator";

export class SignInRequestDTO {
  @IsEmail()
  email: string;

  @IsString()
  @Length(8, 16, {
    message: "密碼長度必須至少8個字符，最多16個字符",
  })
  @Matches(/(?=.*[A-Z])(?=.*\d)/, {
    message: "密碼必須至少包含一個大寫字母和一個數字",
  })
  password: string;
}
