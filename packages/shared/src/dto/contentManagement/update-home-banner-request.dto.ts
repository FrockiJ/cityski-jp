import { Type } from "class-transformer";
import { IsArray, IsString, ValidateNested } from "class-validator";
import { AttachmentRequestDTO } from "../files/attachment-request-dto";

export class UpdateHomeBannerRequestDTO {
  @IsString()
  buttonUrl: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AttachmentRequestDTO)
  attachments: AttachmentRequestDTO[];
}
