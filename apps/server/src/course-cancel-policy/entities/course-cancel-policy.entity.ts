import { CourseCancelPolicyTypeEnum } from '@repo/shared';
import { Course } from 'src/course/entities/course.entity';
import { UserDate } from 'src/shared/entities/user_date.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

@Entity()
export class CourseCancelPolicy extends UserDate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'smallint', nullable: true })
  type: CourseCancelPolicyTypeEnum;

  @Column({ name: 'before_day', type: 'int', nullable: true })
  beforeDay: number;

  @Column({ name: 'within_day', type: 'int', nullable: true })
  withinDay: number;

  @Column({ type: 'int', nullable: true })
  price: number;

  @Column({ type: 'int', nullable: true, default: 1 })
  sequence: number;

  @ManyToOne(() => Course, (course) => course.courseCancelPolicies, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'course_id' })
  course: Course;
}
