import { IsString } from "class-validator";
import { AttachmentResponseDTO } from "../files/attachment-response-dto";

export class GetHomeBannerResponseDTO {
  @IsString()
  buttonUrl: string;

  desktop: AttachmentResponseDTO | null;

  mobile: AttachmentResponseDTO | null;
}
