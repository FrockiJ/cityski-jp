import { UserDate } from 'src/shared/entities/user_date.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { UserRolesDepartments } from './userRolesDepartments.entity';

@Entity()
export class User extends UserDate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column({ type: 'varchar', length: 100 })
  email: string;

  @Column({ type: 'varchar', length: 128 })
  password: string;

  @Column({ type: 'smallint' })
  status: number;

  @Column({ type: 'text', nullable: true })
  refresh: string;

  @Column({ name: 'is_def_password', type: 'char', length: 1 })
  isDefPassword: string;
  // cascade: true save時可以將關聯資料寫在一起儲存
  @OneToMany(() => UserRolesDepartments, (urd) => urd.user, {
    cascade: true,
  })
  userRolesDepartments: UserRolesDepartments[];
}
