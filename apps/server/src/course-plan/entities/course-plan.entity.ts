import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';

import { Course } from 'src/course/entities/course.entity';
import { UserDate } from 'src/shared/entities/user_date.entity';
import { CoursePlanSession } from 'src/course-plan-session/entities/course-plan-session.entity';
import { Order } from 'src/orders/entities/order.entity';

@Entity('course_plan')
export class CoursePlan extends UserDate {
  // -- relations --
  @ManyToOne(() => Course, (course) => course.coursePlans, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'course_id' })
  course: Course;

  @OneToMany(() => CoursePlanSession, (session) => session.plan, {
    cascade: true,
  })
  sessions: CoursePlanSession[];

  @OneToMany(() => Order, (order) => order.coursePlan, {
    cascade: true,
  })
  orders: Order[];

  // -- fields --
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column({ type: 'integer' })
  type: number; // // 0: 無, 1: 單堂體驗, 2: 固定堂數(每人), 3: 共用堂數, 4: 一般私人課

  @Column({ type: 'integer', nullable: true })
  price: number; // Price per session

  @Column({ type: 'integer', nullable: true })
  number: number; // Number of sessions

  @Column({ type: 'varchar', length: 20, nullable: true })
  promotion: string;

  @Column({ type: 'integer' })
  sequence: number; // Display order

  @Column({ type: 'boolean', nullable: true })
  suggestion: boolean;

  @Column({ type: 'integer', nullable: true })
  level: number;
}
