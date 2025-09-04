import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Unique,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Role } from 'src/roles/entities/role.entity';
import { Department } from 'src/departments/entities/department.entity';
@Entity()
@Unique(['user', 'department']) // Each user can have only one role per department
export class UserRolesDepartments {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  // cascade 刪除user會連動刪除關聯不需另外刪除
  @ManyToOne(() => User, (user) => user.userRolesDepartments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Role, (role) => role.userRolesDepartments)
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @ManyToOne(() => Department, (department) => department.userRolesDepartments)
  @JoinColumn({ name: 'department_id' })
  department: Department;
}
