import { IsNumber, IsString, IsUUID } from "class-validator";
import { HomeAreaType } from "../../constants/enums";

export class GetContentManagementResponseDTO {
  @IsUUID()
  id: string;

  @IsString()
  homeAreaTitle: string;

  @IsNumber()
  homeAreaType: HomeAreaType;

  @IsString()
  updatedUser: string;

  @IsString()
  updatedTime: Date;
}
