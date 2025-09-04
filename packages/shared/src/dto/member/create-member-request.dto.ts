import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsPhoneNumber,
  MinLength,
  IsNumber,
  IsPositive,
  Matches,
} from "class-validator";
import { IsDateFormat } from "../../validators/is-date-format.validator";

export class CreateMemberRequestDto {
  @IsEmail({}, { message: "請輸入正確的電子郵件格式" })
  @IsNotEmpty({ message: "Email 不能為空" })
  email: string;

  @IsString()
  @MinLength(8, { message: "密碼至少8個字元" })
  @Matches(/(?=.*[A-Z])/, {
    message: "密碼至少包含一個大寫字母",
  })
  @Matches(/(?=.*\d)/, {
    message: "密碼至少包含一個數字",
  })
  password: string;

  @IsString()
  @IsNotEmpty({ message: "Name is required" })
  name: string;

  @IsPhoneNumber("TW", { message: "Invalid phone number format" })
  @IsOptional()
  phone?: string;

  @IsNumber()
  @IsPositive({ message: "Snowboard level must be a positive number" })
  @IsOptional()
  snowboard?: number;

  @IsNumber()
  @IsPositive({ message: "Skis level must be a positive number" })
  @IsOptional()
  skis?: number;

  // custom validation for custom birthday format
  @IsDateFormat({ message: "Invalid birthday format. Use YYYY/MM/DD" })
  @IsOptional()
  birthday?: string;
}
