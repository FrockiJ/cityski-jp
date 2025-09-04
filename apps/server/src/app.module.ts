import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { MenuModule } from './menu/menu.module';
import { Menu } from './menu/entities/menu.entity';
import { RolesModule } from './roles/roles.module';
import { Role } from './roles/entities/role.entity';
import { DepartmentsModule } from './departments/departments.module';
import { Department } from './departments/entities/department.entity';
import { UserRolesDepartments } from './users/entities/userRolesDepartments.entity';
import { HomeBanner } from './contentManagement/entities/homeBanner.entity';
import { FilesModule } from './files/files.module';
import { File } from './files/entities/file.entity';
import { Member } from './members/entities/member.entity';
import { MembersModule } from './members/members.module';
import { HomeVideo } from './contentManagement/entities/homeVideo.entity';
import { ContentManagementModule } from './contentManagement/contentManagementService.module';
import { DepartmentVenue } from './departments/entities/department-venue.entity';
import { WebhookModule } from './webhook/webhook.module';
import { Discount } from './discounts/entities/discount.entity';
import { DiscountsModule } from './discounts/discounts.module';
import { ScheduleModule } from '@nestjs/schedule';
import { VerificationModule } from './verification/verification.module';
import * as path from 'path';
import { CoursesModule } from './course/courses.module';
import { Course } from './course/entities/course.entity';
import { CourseInfo } from './course-info/entities/course-info.entity';
import { CoursePeople } from './course/entities/course-people.entity';
import { CoursePlanModule } from './course-plan/course-plan.module';
import { CoursePlanSessionModule } from './course-plan-session/course-plan-session.module';
import { CoursePlan } from './course-plan/entities/course-plan.entity';
import { CoursePlanSession } from './course-plan-session/entities/course-plan-session.entity';
import { CourseVenue } from './course/entities/course-venue.entity';
import { SMTPModule } from './smtp/smtp.module';
import { CourseInfoModule } from './course-info/course-info.module';
import { VerificationCode } from './verification/entities/verification-code.entity';
import { CourseCancelPolicy } from './course-cancel-policy/entities/course-cancel-policy.entity';
import { CourseCancelPolicyModule } from './course-cancel-policy/course-cancel-policy.module';
import { HomeModule } from './home/home.module';
import { Order } from './orders/entities/order.entity';
import { OrdersModule } from './orders/orders.module';
import { Transaction } from './transaction/entities/transaction.entity';
import { TransactionsModule } from './transaction/transactions.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      envFilePath: [path.resolve(__dirname, '../../../.env'), '.env'],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const dbSyncEnv = configService.get<string>('DB_SYNC');

        console.log('DB_SYNC env:', dbSyncEnv);
        return {
          type: 'postgres',
          host: configService.get<string>('DB_HOST'),
          port: configService.get<number>('DB_PORT'),
          username: configService.get<string>('DB_USERNAME'),
          password: configService.get<string>('DB_PASSWORD'),
          database: configService.get<string>('DB_DATABASE'),
          entities: [
            User,
            Menu,
            Role,
            Department,
            UserRolesDepartments,
            HomeBanner,
            HomeVideo,
            File,
            Member,
            DepartmentVenue,
            Discount,
            Course,
            CourseInfo,
            CoursePeople,
            CourseCancelPolicy,
            CoursePlan,
            CoursePlanSession,
            CourseVenue,
            VerificationCode,
            Order,
            Transaction,
          ],
          synchronize:
            dbSyncEnv === 'dev'
              ? true
              : configService.get<string>('DB_SYNC') === 'prod'
                ? false
                : true,
        };
      },
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    MenuModule,
    RolesModule,
    DepartmentsModule,
    FilesModule,
    MembersModule,
    ContentManagementModule,
    WebhookModule,
    DiscountsModule,
    VerificationModule,
    CoursesModule,
    CourseInfoModule,
    CourseCancelPolicyModule,
    CoursePlanModule,
    CoursePlanSessionModule,
    SMTPModule,
    HomeModule,
    OrdersModule,
    TransactionsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
