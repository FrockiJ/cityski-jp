import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { IsDateFormat } from "../../validators/is-date-format.validator";

export class LineSigninRequestDto {
  @IsString()
  @IsNotEmpty()
  code: string;
}
