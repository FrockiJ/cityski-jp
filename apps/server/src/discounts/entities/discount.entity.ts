import { DiscountStatusDB, DiscountType } from '@repo/shared';
import { Department } from 'src/departments/entities/department.entity';
import { UserDate } from 'src/shared/entities/user_date.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Discount extends UserDate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 5 })
  code: string;

  @Column({ type: 'char', length: 1 })
  type: DiscountType;

  @Column({ type: 'double precision' })
  discount: number;

  @CreateDateColumn({
    type: 'timestamp',
    name: 'start_date',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  startDate: Date;

  @CreateDateColumn({
    type: 'timestamp',
    name: 'end_date',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  endDate: Date;

  @Column({ type: 'text', nullable: true })
  note: string;

  @Column({ name: 'usage_limit', type: 'int', nullable: true })
  usageLimit: number;

  @Column({ type: 'smallint', default: 1 })
  status: DiscountStatusDB;

  @ManyToOne(() => Department, (department) => department.discounts)
  @JoinColumn({ name: 'department_id' })
  department: Department;
}
