import { IsNotEmpty, IsString, MinLength, Matches } from 'class-validator';

export class ChangePasswordDto {
  @IsNotEmpty({ message: '請輸入舊密碼' })
  @IsString()
  oldPassword: string;

  @IsNotEmpty({ message: '請輸入新密碼' })
  @IsString()
  @MinLength(8, { message: '密碼至少需要8個字元' })
  @Matches(/^(?=.*[A-Z])(?=.*\d)/, {
    message: '密碼需要包含至少一個大寫字母和一個數字',
  })
  newPassword: string;
}
