import { Order } from 'src/orders/entities/order.entity';
import { Reservation } from 'src/reservations/entities/reservation.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class OrderReservation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int' })
  index: number;

  @Column({ name: 'order_id', type: 'uuid' })
  orderId: string;

  @Column({ name: 'reservation_id', type: 'uuid', nullable: true })
  reservationId: string;

  @ManyToOne(() => Order)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @ManyToOne(() => Reservation)
  @JoinColumn({ name: 'reservation_id' })
  reservation: Reservation;
}
