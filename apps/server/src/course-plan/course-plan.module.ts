import { forwardRef, Module } from '@nestjs/common';
import { CoursePlanController } from './course-plan.controller';
import { CoursePlanService } from './course-plan.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoursePlan } from './entities/course-plan.entity';
import { User } from 'src/users/entities/user.entity';
import { Course } from 'src/course/entities/course.entity';
import { CoursePlanSessionModule } from 'src/course-plan-session/course-plan-session.module';
import { CoursesModule } from 'src/course/courses.module';
import { DepartmentVenue } from 'src/departments/entities/department-venue.entity';
import { CoursePlanSession } from 'src/course-plan-session/entities/course-plan-session.entity';
import { Department } from '@repo/shared';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Course,
      CoursePlan,
      CoursePlanSession,
      User,
      Department,
      DepartmentVenue,
    ]),
    forwardRef(() => CoursesModule),
    CoursePlanSessionModule,
  ],
  controllers: [CoursePlanController],
  providers: [CoursePlanService],
  exports: [CoursePlanService],
})
export class CoursePlanModule {}
