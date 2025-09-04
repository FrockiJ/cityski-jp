import { PublicDate } from 'src/shared/entities/public-date.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { Department } from './department.entity';
import { VenueStatus } from '@repo/shared';
import { CourseVenue } from 'src/course/entities/course-venue.entity';

@Entity()
export class DepartmentVenue extends PublicDate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column({ name: 'open_start_time', type: 'varchar', length: 4 })
  openStartTime: string;

  @Column({ name: 'open_end_time', type: 'varchar', length: 4 })
  openEndTime: string;

  @Column({ type: 'smallint', default: VenueStatus.ACTIVE })
  status: VenueStatus;

  // cascade: true, save時可以將關聯資料寫在一起儲存
  @OneToOne(() => CourseVenue, (courseVenue) => courseVenue.departmentVenue, {
    cascade: true,
  })
  courseVenue: CourseVenue;

  @ManyToOne(() => Department, (department) => department.departmentVenues)
  @JoinColumn({ name: 'department_id' })
  department: Department;
}
