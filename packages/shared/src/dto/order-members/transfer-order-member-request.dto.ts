import { IsNotEmpty, IsString } from "class-validator";

export class TransferOrderMemberRequestDto {
  @IsString()
  @IsNotEmpty({ message: "fromId 不能為空" })
  fromId: string;

  @IsString()
  @IsNotEmpty({ message: "toId 不能為空" })
  toId: string;
}
