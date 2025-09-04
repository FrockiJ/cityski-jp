import { IsString } from "class-validator";

export class FileUploadResponseDTO {
  @IsString()
  key: string;
}
