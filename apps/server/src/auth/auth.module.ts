import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from 'src/users/users.module';
import { Role } from 'src/roles/entities/role.entity';
import { UserRolesDepartments } from 'src/users/entities/userRolesDepartments.entity';
import { Menu } from 'src/menu/entities/menu.entity';
import { Member } from 'src/members/entities/member.entity';
import { MembersModule } from 'src/members/members.module';
import { LineService } from './line.service';
import { SMTPService } from 'src/smtp/smtp.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Menu, Role, UserRolesDepartments, Member]),
    JwtModule.registerAsync({
      imports: [ConfigModule], // imports config module
      inject: [ConfigService], // injects the config service
      global: true,
      // acquires the jwt secret from .env file asynchronously
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: '1h',
        },
      }),
    }),
    forwardRef(() => UsersModule),
    forwardRef(() => MembersModule),
  ],
  controllers: [AuthController],
  providers: [AuthService, LineService, SMTPService],
  exports: [LineService, AuthService],
})
export class AuthModule {}
