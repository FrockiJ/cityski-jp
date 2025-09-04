import {
  CourseBkgType,
  CoursePaxLimitType,
  CourseReleaseType,
  CourseRemovalType,
  CourseSkiType,
  CourseStatusType,
  CourseTeachingType,
  CourseType,
} from '@repo/shared';
import { CourseInfo } from 'src/course-info/entities/course-info.entity';
import { Department } from 'src/departments/entities/department.entity';
import { UserDate } from 'src/shared/entities/user_date.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { CoursePeople } from './course-people.entity';
import { CoursePlan } from 'src/course-plan/entities/course-plan.entity';
import { CourseCancelPolicy } from 'src/course-cancel-policy/entities/course-cancel-policy.entity';

@Entity()
export class Course extends UserDate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // -- relations start --
  @ManyToOne(() => Department, (department) => department.courses)
  @JoinColumn({ name: 'department_id' })
  department: Department;

  @OneToMany(() => CoursePeople, (coursePeople) => coursePeople.course, {
    cascade: true,
  })
  coursePeople: CoursePeople[];

  @OneToMany(() => CourseInfo, (courseInfo) => courseInfo.course, {
    cascade: true,
  })
  courseInfos: CourseInfo[];

  @OneToMany(
    () => CourseCancelPolicy,
    (courseCancelPolicy) => courseCancelPolicy.course,
    {
      cascade: true,
    },
  )
  courseCancelPolicies: CourseCancelPolicy[];

  @OneToMany(() => CoursePlan, (coursePlan) => coursePlan.course)
  coursePlans: CoursePlan[];
  // -- relations end --

  @Column({ type: 'varchar', length: 5 })
  no: string;

  @Column({ type: 'char', length: 1 })
  type: CourseType;

  @Column({ name: 'teaching_type', type: 'smallint', nullable: true })
  teachingType: CourseTeachingType;

  @Column({ type: 'smallint' })
  status: CourseStatusType;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column({ name: 'ski_type', type: 'smallint', nullable: true })
  skiType: CourseSkiType;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text', nullable: true })
  explanation: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  promotion: string;

  @Column({ name: 'bkg_type', type: 'smallint', nullable: true })
  bkgType: CourseBkgType;

  @Column({ type: 'int', nullable: true })
  length: number;

  @Column({
    name: 'bkg_start_day',
    type: 'int',
    nullable: true,
  })
  bkgStartDay: number;

  @Column({
    name: 'bkg_latest_day_unit',
    type: 'char',
    length: 1,
    nullable: true,
  })
  bkgLatestDayUnit: string;

  @Column({
    name: 'bkg_latest_day',
    type: 'int',
    nullable: true,
  })
  bkgLatestDay: number;

  @Column({
    name: 'pax_limit_type',
    type: 'char',
    length: 1,
    nullable: true,
  })
  paxLimitType: CoursePaxLimitType;

  @Column({
    name: 'release_type',
    type: 'char',
    length: 1,
    nullable: true,
  })
  releaseType: CourseReleaseType;

  @CreateDateColumn({
    type: 'timestamp',
    name: 'release_date',
    default: () => 'CURRENT_TIMESTAMP(6)',
    nullable: true,
  })
  releaseDate: Date;

  @Column({
    name: 'removal_type',
    type: 'char',
    length: 1,
    nullable: true,
  })
  removalType: CourseRemovalType;

  @CreateDateColumn({
    type: 'timestamp',
    name: 'removal_date',
    default: () => 'CURRENT_TIMESTAMP(6)',
    nullable: true,
  })
  removalDate: Date;

  @CreateDateColumn({
    type: 'timestamp',
    name: 'actual_removal_date',
    default: () => 'CURRENT_TIMESTAMP(6)',
    nullable: true,
  })
  actualRemovalDate: Date;

  @Column({
    name: 'check_bef_day',
    type: 'int',
    nullable: true,
  })
  checkBefDay: number;

  @Column({
    type: 'boolean',
    nullable: true,
  })
  cancelable: boolean;

  @Column({
    type: 'int',
    nullable: true,
  })
  sequence: number;
}
