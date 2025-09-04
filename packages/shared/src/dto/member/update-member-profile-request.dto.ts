import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsPhoneNumber,
} from "class-validator";
import { IsDateFormat } from "../../validators/is-date-format.validator";

export class UpdateMemberProfileRequestDto {
  @IsString()
  @IsNotEmpty({ message: "Name is required" })
  @IsOptional()
  name?: string;

  @IsPhoneNumber("TW", { message: "Invalid phone number format" })
  @IsOptional()
  phone?: string;

  // custom validation for custom birthday format
  @IsDateFormat({ message: "Invalid birthday format. Use YYYY/MM/DD" })
  @IsOptional()
  birthday?: string;
}
