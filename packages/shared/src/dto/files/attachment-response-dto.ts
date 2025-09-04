import { IsNumber, IsOptional, IsString, IsUUID } from "class-validator";
import { AttachmentDeviceType } from "../../constants/enums";

export class AttachmentResponseDTO {
  @IsUUID()
  id: string;

  @IsString()
  url: string;

  @IsString()
  description: string;

  @IsString()
  originalName: string;

  @IsString()
  mediaType: string;

  @IsString()
  deviceType: AttachmentDeviceType;

  @IsNumber()
  @IsOptional()
  sequence?: number;
}
