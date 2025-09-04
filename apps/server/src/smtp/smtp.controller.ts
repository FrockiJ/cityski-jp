import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { SMTPService } from './smtp.service';

@Controller('smtp')
// @UseGuards(AuthGuard)
export class SMTPController {
  constructor(private readonly smtpService: SMTPService) {}

  @Post('/send-example')
  @HttpCode(HttpStatus.ACCEPTED)
  async sendExampleMail(@Body() body: { email: string }) {
    return this.smtpService.sendExampleMail(body.email);
  }
}
