import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { IsDateFormat } from "../../validators/is-date-format.validator";

export class LineSignupRequestDto {
  @IsString()
  @IsNotEmpty()
  id_token: string;

  @IsString()
  @IsNotEmpty()
  access_token: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  // custom validation for custom birthday format
  @IsDateFormat({ message: "Invalid birthday format. Use YYYY/MM/DD" })
  @IsNotEmpty()
  birthday: string;
}
