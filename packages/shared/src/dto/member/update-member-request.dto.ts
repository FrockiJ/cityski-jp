import {
  IsOptional,
  IsNumber,
  IsPositive,
  IsString,
  IsNotEmpty,
  Min,
  Max,
} from "class-validator";

export class UpdateMemberRequestDTO {
  @IsString()
  @IsNotEmpty({ message: "Name cannot be empty." })
  @IsOptional()
  name?: string;

  @IsNumber()
  @IsPositive({ message: "Snowboard level must be a positive number" })
  @Min(1, { message: "Snowboard level must be at least 1" })
  @Max(20, { message: "Snowboard level must not exceed 20" })
  @IsOptional()
  snowboardLevel?: number;

  @IsNumber()
  @IsPositive({ message: "Skis level must be a positive number" })
  @Min(1, { message: "Skis level must be at least 1" })
  @Max(20, { message: "Skis level must not exceed 20" })
  @IsOptional()
  skiLevel?: number;

  @IsString()
  @IsNotEmpty({ message: "Note cannot be empty." })
  @IsOptional()
  note?: string;
}
