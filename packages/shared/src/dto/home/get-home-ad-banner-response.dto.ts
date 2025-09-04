import { IsString } from "class-validator";

export class GetHomeAdBannerResponseDTO {
  @IsString()
  buttonUrl: string;

  @IsString()
  desktopImgSrc: string;

  @IsString()
  mobileImgSrc: string;
}
