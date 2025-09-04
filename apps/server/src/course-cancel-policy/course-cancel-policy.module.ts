import { Module } from '@nestjs/common';
import { Course } from 'src/course/entities/course.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseCancelPolicyService } from './course-cancel-policy.service';
import { CourseCancelPolicy } from './entities/course-cancel-policy.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Course, CourseCancelPolicy])],
  providers: [CourseCancelPolicyService],
  exports: [CourseCancelPolicyService],
})
export class CourseCancelPolicyModule {}
