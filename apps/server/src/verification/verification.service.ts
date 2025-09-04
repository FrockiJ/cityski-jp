import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Twilio from 'twilio';
import { VerificationCode } from './entities/verification-code.entity';
import { MoreThan, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomException } from 'src/common/exception/custom.exception';

@Injectable()
export class VerificationService {
  private twilioClient: Twilio.Twilio;

  constructor(
    @InjectRepository(VerificationCode)
    private readonly verificationCodeRepo: Repository<VerificationCode>,
    private readonly configService: ConfigService,
  ) {
    this.twilioClient = Twilio(
      this.configService.get('TWILIO_ACCOUNT_SID'),
      this.configService.get('TWILIO_AUTH_TOKEN'),
    );
  }

  /**
   * Sends a verification code to a user's phone number.
   **/
  async sendVerificationCode(phoneNumber: string): Promise<string> {
    // generates a random 6 digit code
    const randomCode = Array.from({ length: 6 }, () =>
      Math.floor(Math.random() * 9),
    ).join('');

    try {
      await this.twilioClient.messages.create({
        body: `Your verification code is: ${randomCode}`, // sms code to user
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phoneNumber,
      });

      // check if verification code exists already
      const existingCode = await this.getVerificationCode(phoneNumber);

      if (existingCode) {
        // update the entry
        existingCode.code = randomCode;
        // reset expire time
        existingCode.expireTime = new Date(Date.now() + 3 * 60 * 1000);
        await this.verificationCodeRepo.save(existingCode);

        return 'success';
      }
      // create verification code entry
      const expireTimeLocalTime = new Date(Date.now() + 3 * 60 * 1000); // 3 minutes

      const expireTime = new Date(expireTimeLocalTime.toISOString());

      // console.log('expireTime local:', expireTimeLocalTime);
      // console.log('expireTime UTC:', expireTime);

      const createdCode = this.verificationCodeRepo.create({
        code: randomCode,
        phoneNumber,
        expireTime: expireTime,
        ...new VerificationCode(),
      });

      await this.verificationCodeRepo.save(createdCode);

      return 'success';
    } catch (error) {
      console.error('Error sending SMS:', error);
      throw new CustomException(
        'Failed to send verification code.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Verifies a code based on the phone number passed in.
   **/
  async verifyCode(
    phoneNumber: string,
    code: string,
  ): Promise<{ codeVerified: boolean }> {
    try {
      const matchedCode = await this.verificationCodeRepo.findOneBy({
        phoneNumber,
        expireTime: MoreThan(new Date()),
      });

      // console.log('matchedCode', matchedCode);

      if (!matchedCode) {
        // code expired
        throw new CustomException('驗證碼逾期', HttpStatus.BAD_REQUEST);
      }

      // check if code does not match

      if (code !== matchedCode.code) {
        // reject access.
        throw new CustomException(`驗證失敗重新輸入`, HttpStatus.BAD_REQUEST);
      }

      // success and clean up
      await this.verificationCodeRepo.remove(matchedCode);

      return { codeVerified: true };
    } catch (error) {
      if (error instanceof CustomException) {
        throw error;
      }

      // unexpected errors

      console.error('Unexpected error:', error);

      throw new CustomException(
        '驗證過程中發生意外錯誤。',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getVerificationCode(phoneNumber: string): Promise<VerificationCode> {
    try {
      return await this.verificationCodeRepo.findOneBy({
        phoneNumber,
      });
    } catch (err) {
      throw new CustomException(
        '檢查驗證碼時發生錯誤。',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
