import { Injectable } from '@nestjs/common';
import { LessThan, Repository } from 'typeorm';
import { VerificationCode } from './entities/verification-code.entity';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class VerificationCleanupService {
  constructor(
    @InjectRepository(VerificationCode)
    private readonly verificationCodeRepo: Repository<VerificationCode>,
  ) {}

  // clean up unverified verification codes every hour, for code older than 3 minutes
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async cleanup() {
    // three minutes *and one second* ago - a buffer to prevent race conditions with actual timer
    const thresholdTime = new Date(Date.now() - 3 * 60 * 1000 + 1000);

    console.log('Cleaning up verification codes');

    try {
      await this.verificationCodeRepo.delete({
        expireTime: LessThan(thresholdTime),
      });
    } catch (err) {
      console.log('Error when attempting to clean verificaiton codes:', err);
    }

    console.log('Expired verification codes cleaned up');
  }
}
