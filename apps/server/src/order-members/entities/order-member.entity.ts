import { Order } from 'src/orders/entities/order.entity';
import { Member } from 'src/members/entities/member.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { ReservationMember } from 'src/reservation-members/entities/reservation-member.entity';

@Entity()
export class OrderMember {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'order_id', type: 'uuid' })
  orderId: string;

  @Column({ name: 'member_id', type: 'uuid' })
  memberId: string;

  @ManyToOne(() => Order, (order) => order.orderMembers)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @ManyToOne(() => Member, (member) => member.orderMembers)
  @JoinColumn({ name: 'member_id' })
  member: Member;
  
  @OneToMany(() => ReservationMember, (reservationMember) => reservationMember.orderMember)
  reservationMembers: ReservationMember[];

  

  
}
