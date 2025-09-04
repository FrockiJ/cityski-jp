import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from '../auth/auth.module';
import { SMTPController } from './smtp.controller';
import { SMTPService } from './smtp.service';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([User]),
    JwtModule,
    AuthModule,
  ],
  exports: [SMTPService],
  controllers: [SMTPController],
  providers: [SMTPService],
})
export class SMTPModule {}
