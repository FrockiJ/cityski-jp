import {
  CourseBkgType,
  CoursePlanTypeEnum,
  CourseSkiType,
  CourseType,
  OrderChannelEnum,
  OrderStatusEnum,
} from '@repo/shared';
import { CoursePlan } from 'src/course-plan/entities/course-plan.entity';
import { Department } from 'src/departments/entities/department.entity';
import { Member } from 'src/members/entities/member.entity';
import { UserDate } from 'src/shared/entities/user_date.entity';
import { Transaction } from 'src/transaction/entities/transaction.entity';
import { OrderMember } from 'src/order-members/entities/order-member.entity';
import { OrderReservation } from 'src/order-reservations/entities/order-reservation.entity';
import { OrderHistory } from 'src/order-history/entities/order-history.entity';
import { OrderInvitation } from 'src/order-invitations/entities/order-invitation.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';

@Entity()
export class Order extends UserDate {
  @ManyToOne(() => Department, (department) => department.orders)
  @JoinColumn({ name: 'department_id' })
  department: Department;

  @ManyToOne(() => CoursePlan, (coursePlan) => coursePlan.orders)
  @JoinColumn({ name: 'course_plan_id' })
  coursePlan: CoursePlan;

  @ManyToOne(() => Member, (member) => member.orders)
  @JoinColumn({ name: 'orderer' })
  member: Member;

  // cascade: true, save時可以將關聯資料寫在一起儲存
  @OneToOne(() => Transaction, (transaction) => transaction.order, {
    cascade: true,
  })
  transaction: Transaction;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', unique: true, length: 15 })
  no: string;

  @Column({ type: 'uuid' })
  orderer: string;

  @Column({ type: 'varchar', length: 1 })
  type: CourseType;

  @Column({ name: 'ski_type', type: 'smallint' })
  skiType: CourseSkiType;

  @Column({ name: 'bkg_type', type: 'smallint' })
  bkgType: CourseBkgType;

  @Column({ name: 'plan_number', type: 'int' })
  planNumber: number;

  @Column({ name: 'plan_type', type: 'smallint', nullable: true })
  planType: CoursePlanTypeEnum;

  @Column({ name: 'adult_count', type: 'int', nullable: true })
  adultCount: number;

  @Column({ name: 'child_count', type: 'int', nullable: true })
  childCount: number;

  @Column({ name: 'discount_id', type: 'uuid', nullable: true })
  discountId: string;

  @CreateDateColumn({
    type: 'timestamp',
    name: 'auto_cancel_date',
    default: () => 'CURRENT_TIMESTAMP(6)',
    nullable: true,
  })
  autoCancelDate: Date;

  @CreateDateColumn({
    type: 'timestamp',
    name: 'cancel_date',
    nullable: true,
  })
  cancelDate: Date;

  @Column({
    type: 'timestamp',
    name: 'exp_date',
    nullable: true,
  })
  expDate: Date;

  @Column({ type: 'varchar', length: 1 })
  channel: OrderChannelEnum;

  @Column({ type: 'smallint' })
  status: OrderStatusEnum;

  @OneToMany(() => OrderMember, (orderMember) => orderMember.order)
  orderMembers: OrderMember[];

  @OneToMany(
    () => OrderReservation,
    (orderReservation) => orderReservation.order,
  )
  orderReservations: OrderReservation[];

  @OneToMany(() => OrderHistory, (orderHistory) => orderHistory.order)
  orderHistories: OrderHistory[];

  @OneToMany(() => OrderInvitation, (orderInvitation) => orderInvitation.order)
  orderInvitations: OrderInvitation[];
}
