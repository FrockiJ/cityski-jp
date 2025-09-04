import { PublicDate } from 'src/shared/entities/public-date.entity';
import { UserRolesDepartments } from 'src/users/entities/userRolesDepartments.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { DepartmentVenue } from './department-venue.entity';
import { Discount } from 'src/discounts/entities/discount.entity';
import { Course } from 'src/course/entities/course.entity';
import { CourseVenue } from 'src/course/entities/course-venue.entity';
import { Order } from 'src/orders/entities/order.entity';

@Entity()
export class Department extends PublicDate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', unique: true, length: 50 })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  address: string;

  @Column({ type: 'varchar', length: 30, nullable: true })
  phone: string;

  @Column({ type: 'int' })
  sequence: number;

  @Column({ type: 'smallint', default: 1 })
  status: number;

  @Column({ name: 'bank_code', type: 'varchar', length: 5, nullable: false })
  bankCode: string;

  @Column({ name: 'bank_name', type: 'varchar', length: 10, nullable: false })
  bankName: string;

  @Column({
    name: 'bank_branch_name',
    type: 'varchar',
    length: 20,
    nullable: false,
  })
  bankBranchName: string;

  @Column({
    name: 'bank_account',
    type: 'varchar',
    length: 20,
    nullable: false,
  })
  bankAccount: string;

  @Column({
    name: 'bank_account_name',
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  bankAccountName: string;

  @ManyToOne(() => Department, (department) => department.children, {
    nullable: true,
  })
  @JoinColumn({ name: 'parent_id' })
  parent: Department;

  @OneToMany(() => Department, (department) => department.parent)
  children: Department[];

  @OneToMany(() => UserRolesDepartments, (urd) => urd.department)
  userRolesDepartments: UserRolesDepartments[];

  // cascade: true, save時可以將關聯資料寫在一起儲存
  @OneToMany(
    () => DepartmentVenue,
    (departmentVenue) => departmentVenue.department,
    {
      cascade: true,
    },
  )
  departmentVenues: DepartmentVenue[];

  // cascade: true, save時可以將關聯資料寫在一起儲存
  @OneToMany(() => CourseVenue, (courseVenue) => courseVenue.department, {
    cascade: true,
  })
  courseVenues: CourseVenue[];

  // cascade: true, save時可以將關聯資料寫在一起儲存
  @OneToMany(() => Discount, (discount) => discount.department, {
    cascade: true,
  })
  discounts: Discount[];

  // cascade: true, save時可以將關聯資料寫在一起儲存
  @OneToMany(() => Course, (course) => course.department, {
    cascade: true,
  })
  courses: Course[];

  // cascade: true, save時可以將關聯資料寫在一起儲存
  @OneToMany(() => Order, (order) => order.department, {
    cascade: true,
  })
  orders: Order[];
}
