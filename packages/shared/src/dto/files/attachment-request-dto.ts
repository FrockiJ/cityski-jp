import { IsNumber, IsOptional, IsString } from "class-validator";
import { AttachmentDeviceType } from "../../constants/enums";

export class AttachmentRequestDTO {
  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  key: string;

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
