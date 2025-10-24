import { Order } from 'src/orders/entities/order.entity';
import { Member } from 'src/members/entities/member.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class OrderMember {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'order_id', type: 'uuid' })
  orderId: string;

  @Column({ name: 'member_id', type: 'uuid' })
  memberId: string;

  @Column({ name: 'course_count', type: 'int' })
  courseCount: number;

  @Column({ name: 'course_left', type: 'int' })
  courseLeft: number;

  @ManyToOne(() => Order, (order) => order.orderMembers)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @ManyToOne(() => Member, (member) => member.orderMembers)
  @JoinColumn({ name: 'member_id' })
  member: Member;
}
