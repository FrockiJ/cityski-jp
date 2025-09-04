import { Module } from '@nestjs/common';
import { VerificationService } from './verification.service';
import { VerificationController } from './verification.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VerificationCode } from './entities/verification-code.entity';
import { VerificationCleanupService } from './verification-cleanup.service';

@Module({
  imports: [TypeOrmModule.forFeature([VerificationCode])],
  providers: [VerificationService, VerificationCleanupService],
  controllers: [VerificationController],
})
export class VerificationModule { }
