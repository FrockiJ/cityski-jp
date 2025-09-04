import { IsNumber, IsString } from "class-validator";
import { GetUsersResponseDTO } from "../users/get-users-response.dto";
import { MemberResponseDto } from "../member/get-members-response.dto";

export class RefreshTokenResponseDTO {
  @IsString()
  accessToken: string;

  @IsString()
  refreshToken: string;

  @IsNumber()
  expiresIn: number;

  @IsNumber()
  refreshExpiresIn: number;

  userInfo: MemberResponseDto | GetUsersResponseDTO;
}
