import { forwardRef, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { DepartmentsModule } from 'src/departments/departments.module';
import { Department } from 'src/departments/entities/department.entity';
import { UserRolesDepartments } from './entities/userRolesDepartments.entity';
import { Role } from 'src/roles/entities/role.entity';
import { RolesModule } from 'src/roles/roles.module';
import { SMTPService } from 'src/smtp/smtp.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role, Department, UserRolesDepartments]),
    forwardRef(() => DepartmentsModule),
    forwardRef(() => RolesModule),
  ],
  controllers: [UsersController],
  providers: [UsersService, SMTPService],
  exports: [UsersService],
})
export class UsersModule {}
