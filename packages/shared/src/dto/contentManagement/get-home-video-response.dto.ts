import { IsNumber, IsString } from "class-validator";
import { AttachmentResponseDTO } from "../files/attachment-response-dto";
import { Expose } from "class-transformer";

export class GetHomeVideoResponseDTO {
  @IsString()
  @Expose()
  id: string;

  @IsString()
  @Expose()
  name: string;

  @IsString()
  @Expose()
  url: string;

  @IsString()
  @Expose()
  buttonName: string;

  @IsString()
  @Expose()
  buttonUrl: string;

  @IsNumber()
  @Expose()
  sort: number;
}
