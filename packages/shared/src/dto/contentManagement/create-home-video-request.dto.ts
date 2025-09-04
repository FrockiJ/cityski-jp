import { IsNumber, IsString } from "class-validator";

export class CreateHomeVideoRequestDTO {
  @IsString()
  name: string;

  @IsString()
  url: string;

  @IsString()
  buttonName: string;

  @IsString()
  buttonUrl: string;

  @IsNumber()
  sort: number;
}
