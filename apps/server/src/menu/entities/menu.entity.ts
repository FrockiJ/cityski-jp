import { Role } from 'src/roles/entities/role.entity';
import { PublicDate } from 'src/shared/entities/public-date.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';

@Entity('menu')
export class Menu extends PublicDate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', name: 'group_name', length: 255 })
  groupName: string;

  @Column({ type: 'varchar', length: 20 })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  path: string;

  @Column({ type: 'int' })
  sequence: number;

  @Column({ type: 'smallint', default: 1 })
  status: number;

  @Column({ type: 'smallint', nullable: true })
  icon: number;

  @ManyToOne(() => Menu, (menu) => menu.subPages, { nullable: true })
  @JoinColumn({ name: 'parent_id' })
  parent: Menu;

  @OneToMany(() => Menu, (menu) => menu.parent)
  @JoinColumn({ name: 'sub_pages' })
  subPages: Menu[];

  @ManyToMany(() => Role, (role) => role.menus)
  @JoinTable({ name: 'menu_roles' })
  roles: Role[];
}
