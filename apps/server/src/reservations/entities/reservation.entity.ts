import { SkiAndSnowboardLevelEnum } from '@repo/shared';
import { Department } from 'src/departments/entities/department.entity';
import { UserDate } from 'src/shared/entities/user_date.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Generated,
} from 'typeorm';

// 課程狀態 enum
export enum ReservationStatus {
  SCHEDULED = 1, // 已排定
  COMPLETED = 2, // 已完成
  CANCELED = 9,  // 已取消
}

@Entity()
export class Reservation extends UserDate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Department, (department) => department.reservations)
  @JoinColumn({ name: 'department_id' })
  department: Department;

  @Column({ name: 'reservation_no', type: 'int' })
  @Generated('increment')
  reservationNo: number;

  @Column({ name: 'reservation_status', type: 'smallint' })
  reservationStatus: ReservationStatus;

  @Column({ name: 'class_time', type: 'timestamp' })
  classTime: Date;

  @Column({ name: 'teaching_level', type: 'varchar', length: 2 })
  teachingLevel: SkiAndSnowboardLevelEnum;

  @Column({ name: 'instructor', type: 'varchar', length: 100, nullable: true })
  instructor: string;
}