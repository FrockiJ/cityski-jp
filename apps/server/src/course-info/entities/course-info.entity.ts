import { CourseInfoType } from '@repo/shared';
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
export class CourseInfo extends UserDate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'char', length: 1, nullable: true })
  type: CourseInfoType;

  @Column({ type: 'text', nullable: true })
  explanation: string;

  @Column({ type: 'int', nullable: true })
  sequence: number;

  @ManyToOne(() => Course, (course) => course.courseInfos, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'course_id' })
  course: Course;
}
