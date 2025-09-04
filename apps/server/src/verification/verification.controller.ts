import { Body, Controller, Post, Req } from '@nestjs/common';
import { VerificationService } from './verification.service';
import { CustomRequest } from 'src/shared/interfaces/custom-request';
import { SendVerificationCodeDto, VerifyCodeDto } from '@repo/shared';

@Controller('verification')
export class VerificationController {
  constructor(private readonly verificationService: VerificationService) {}

  @Post('send')
  async sendCode(
    @Body() { phoneNumber }: SendVerificationCodeDto,
    @Req() req: CustomRequest,
  ) {
    req.message = 'Verification code sent';

    return await this.verificationService.sendVerificationCode(phoneNumber);
  }

  @Post('verify')
  async verifyCode(@Body() { phoneNumber, code }: VerifyCodeDto) {
    return await this.verificationService.verifyCode(phoneNumber, code);
  }
}
