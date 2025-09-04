import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from "class-validator";

export function IsDateFormat(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: "isBirthdayFormat",
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, _args: ValidationArguments) {
          console.log("Validating Custom Date...");
          const customDateFormatRegex = /^\d{4}\/\d{2}\/\d{2}$/;
          return typeof value === "string" && customDateFormatRegex.test(value);
        },
        defaultMessage() {
          return "Date must be in YYYY/MM/DD format";
        },
      },
    });
  };
}
