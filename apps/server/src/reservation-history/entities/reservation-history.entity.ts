import { Reservation } from 'src/reservations/entities/reservation.entity';
import { UserDate } from 'src/shared/entities/user_date.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class ReservationHistory extends UserDate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Reservation, { nullable: false })
  @JoinColumn({ name: 'reservation_id' })
  reservation: Reservation;

  @Column({ name: 'reservation_id', type: 'uuid' })
  reservationId: string;

  @Column({ type: 'varchar', length: 100 })
  event: string;

  @Column({ type: 'varchar', length: 100 })
  operator: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  time: Date;

  @Column({ type: 'text', nullable: true })
  reason: string;
}