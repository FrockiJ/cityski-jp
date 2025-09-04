import { forwardRef, Module } from '@nestjs/common';
import { Course } from './entities/course.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';
import { UsersModule } from 'src/users/users.module';
import { User } from 'src/users/entities/user.entity';
import { CoursePeople } from './entities/course-people.entity';
import { CourseInfo } from 'src/course-info/entities/course-info.entity';
import { File } from 'src/files/entities/file.entity';
import { Department } from 'src/departments/entities/department.entity';
import { CourseVenue } from './entities/course-venue.entity';
import { CoursePlanModule } from 'src/course-plan/course-plan.module';
import { CourseInfoModule } from 'src/course-info/course-info.module';
import { FilesModule } from 'src/files/files.module';
import { CourseCancelPolicyModule } from 'src/course-cancel-policy/course-cancel-policy.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Course,
      CoursePeople,
      CourseInfo,
      CourseVenue,
      User,
      File,
      Department,
    ]),
    forwardRef(() => UsersModule),
    forwardRef(() => CoursePlanModule),
    forwardRef(() => CourseInfoModule),
    forwardRef(() => FilesModule),
    forwardRef(() => CourseCancelPolicyModule),
  ],
  controllers: [CoursesController],
  providers: [CoursesService],
  exports: [CoursesService],
})
export class CoursesModule {}
