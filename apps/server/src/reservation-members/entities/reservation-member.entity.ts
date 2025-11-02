import { Reservation } from 'src/reservations/entities/reservation.entity';
import { OrderMember } from 'src/order-members/entities/order-member.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class ReservationMember {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'reservation_id', type: 'uuid' })
  reservationId: string;

  @Column({ name: 'order_member_id', type: 'uuid' })
  orderMemberId: string;

  @Column({ type: 'text', nullable: true })
  note: string;

  @Column({ type: 'boolean', default: true })
  attended: boolean;

  @ManyToOne(() => Reservation, (reservation) => reservation.reservationMembers)
  @JoinColumn({ name: 'reservation_id' })
  reservation: Reservation;

  @ManyToOne(() => OrderMember, (orderMember) => orderMember.reservationMembers)
  @JoinColumn({ name: 'order_member_id' })
  orderMember: OrderMember;
}
