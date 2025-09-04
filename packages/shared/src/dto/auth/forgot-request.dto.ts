import {
  IsEmail,
  IsOptional,
  IsString,
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";

@ValidatorConstraint({ name: "EitherEmailOrToken", async: false })
class EitherEmailOrToken implements ValidatorConstraintInterface {
  validate(_: any, args: ValidationArguments) {
    const object = args.object as ForgotRequestDTO;
    return !!object.email || !!object.token; // 確保至少有一個欄位有值
  }

  defaultMessage(args: ValidationArguments) {
    return "email或token至少要填寫一個";
  }
}

export class ForgotRequestDTO {
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  token?: string;

  @Validate(EitherEmailOrToken)
  eitherEmailOrToken: boolean;
}
