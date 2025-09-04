import { CoursePeopleType } from '@repo/shared';
import { UserDate } from 'src/shared/entities/user_date.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Course } from './course.entity';

@Entity()
export class CoursePeople extends UserDate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'smallint', nullable: true })
  type: CoursePeopleType;

  @Column({ name: 'min_people', type: 'int', nullable: true })
  minPeople: number;

  @Column({ name: 'max_people', type: 'int', nullable: true })
  maxPeople: number;

  @Column({ name: 'base_people', type: 'int', nullable: true })
  basePeople: number;

  @Column({ name: 'add_price', type: 'int', nullable: true })
  addPrice: number;

  @ManyToOne(() => Course, (course) => course.coursePeople, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'course_id' })
  course: Course;
}
