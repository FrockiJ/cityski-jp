import { CoursePlan } from 'src/course-plan/entities/course-plan.entity';
import { UserDate } from 'src/shared/entities/user_date.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('course_plan_session')
export class CoursePlanSession extends UserDate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => CoursePlan, (plan) => plan.sessions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'plan_id' })
  plan: CoursePlan;

  @Column({ type: 'integer' })
  no: number; // Session number

  @Column({ name: 'start_time', type: 'timestamp', nullable: true })
  startTime: Date;

  @Column({ name: 'end_time', type: 'timestamp', nullable: true })
  endTime: Date;
}
