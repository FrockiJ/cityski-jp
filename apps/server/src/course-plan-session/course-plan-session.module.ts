import { Module } from '@nestjs/common';
import { CoursePlanSessionController } from './course-plan-session.controller';
import { CoursePlanSessionService } from './course-plan-session.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoursePlan } from 'src/course-plan/entities/course-plan.entity';
import { CoursePlanSession } from './entities/course-plan-session.entity';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CoursePlan, CoursePlanSession, User])],
  controllers: [CoursePlanSessionController],
  providers: [CoursePlanSessionService],
  exports: [CoursePlanSessionService],
})
export class CoursePlanSessionModule {}
