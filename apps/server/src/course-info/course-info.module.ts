import { Module } from '@nestjs/common';
import { Course } from 'src/course/entities/course.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseInfoService } from './course-info.service';
import { CourseInfo } from './entities/course-info.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Course, CourseInfo])],
  providers: [CourseInfoService],
  exports: [CourseInfoService],
})
export class CourseInfoModule {}
