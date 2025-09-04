import { Menu } from 'src/menu/entities/menu.entity';
import { PublicDate } from 'src/shared/entities/public-date.entity';
import { UserRolesDepartments } from 'src/users/entities/userRolesDepartments.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  OneToMany,
} from 'typeorm';

@Entity()
export class Role extends PublicDate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', unique: true, length: 100 })
  name: string;

  @Column({ name: 'super_adm', type: 'smallint', default: 0 })
  superAdm: number;

  @Column({ type: 'smallint', default: 1 })
  status: number;

  @ManyToMany(() => Menu, (menu) => menu.roles)
  menus: Menu[];

  @OneToMany(() => UserRolesDepartments, (urd) => urd.role)
  userRolesDepartments: UserRolesDepartments[];
}
