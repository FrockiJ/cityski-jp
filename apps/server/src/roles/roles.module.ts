import { forwardRef, Module } from '@nestjs/common';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from 'src/roles/entities/role.entity';
import { Menu } from 'src/menu/entities/menu.entity';
import { MenuModule } from 'src/menu/menu.module';
import { UserRolesDepartments } from 'src/users/entities/userRolesDepartments.entity';
import { UsersModule } from 'src/users/users.module';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Role, Menu, User, UserRolesDepartments]),
    forwardRef(() => MenuModule),
    forwardRef(() => UsersModule),
  ],
  controllers: [RolesController],
  providers: [RolesService],
  exports: [RolesService],
})
export class RolesModule {}
