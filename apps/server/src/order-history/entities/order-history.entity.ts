import { Order } from 'src/orders/entities/order.entity';
import { UserDate } from 'src/shared/entities/user_date.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class OrderHistory extends UserDate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Order, { nullable: false })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column({ name: 'order_id', type: 'uuid' })
  orderId: string;

  @Column({ type: 'varchar', length: 100 })
  event: string;

  @Column({ type: 'varchar', length: 100 })
  operator: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  time: Date;

  @Column({ type: 'text', nullable: true })
  reason: string;
}