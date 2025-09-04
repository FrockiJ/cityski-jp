import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  OneToOne,
  ManyToOne,
} from 'typeorm';
import { Department } from 'src/departments/entities/department.entity';
import { DepartmentVenue } from 'src/departments/entities/department-venue.entity';
import { UserDate } from 'src/shared/entities/user_date.entity';

@Entity()
export class CourseVenue extends UserDate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'boolean', default: true })
  group: boolean;

  @Column({ type: 'boolean', default: true })
  private: boolean;

  @Column({ type: 'boolean', default: true })
  individual: boolean;

  @ManyToOne(() => Department, (department) => department.departmentVenues, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'department_id' })
  department: Department;

  @OneToOne(() => DepartmentVenue, (venue) => venue.courseVenue, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'department_venue_id' })
  departmentVenue: DepartmentVenue;
}
