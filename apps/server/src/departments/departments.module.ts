import { forwardRef, Module } from '@nestjs/common';
import { DepartmentsController } from './departments.controller';
import { DepartmentsService } from './departments.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Department } from './entities/department.entity';
import { UsersModule } from 'src/users/users.module';
import { UserRolesDepartments } from 'src/users/entities/userRolesDepartments.entity';
import { User } from 'src/users/entities/user.entity';
import { DepartmentVenue } from './entities/department-venue.entity';
import { CourseVenue } from 'src/course/entities/course-venue.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Department,
      UserRolesDepartments,
      User,
      DepartmentVenue,
      CourseVenue,
    ]),
    forwardRef(() => UsersModule),
  ],
  controllers: [DepartmentsController],
  providers: [DepartmentsService],
  exports: [DepartmentsService],
})
export class DepartmentsModule {}
