import { TransactionStatusEnum } from '@repo/shared';
import { Order } from 'src/orders/entities/order.entity';
import { UserDate } from 'src/shared/entities/user_date.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  CreateDateColumn,
  OneToOne,
} from 'typeorm';

@Entity()
export class Transaction extends UserDate {
  @OneToOne(() => Order, (order) => order.transaction)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'total_amt', type: 'int' })
  totalAmt: number;

  @Column({ name: 'discount_fee', type: 'int' })
  discountFee: number;

  @Column({ name: 'deposit_amt', type: 'int', nullable: true })
  depositAmt: number;

  @Column({
    type: 'timestamp',
    name: 'deposit_date',
    nullable: true,
  })
  depositDate: Date;

  @Column({ name: 'balance_amt', type: 'int', nullable: true })
  balanceAmt: number;

  @Column({
    type: 'timestamp',
    name: 'balance_date',
    nullable: true,
  })
  balanceDate: Date;

  @Column({ type: 'smallint' })
  status: TransactionStatusEnum;

  @Column({ name: 'trf_account', type: 'varchar', length: 5, nullable: true })
  trfAccount: string;

  @Column({ name: 'trf_amt', type: 'int', nullable: true })
  trfAmt: string;

  @Column({ name: 'balance_payment_method', type: 'varchar', length: 10, nullable: true })
  balancePaymentMethod: string;

  @Column({ name: 'balance_invoice', type: 'varchar', length: 50, nullable: true })
  balanceInvoice: string;

  @CreateDateColumn({
    type: 'timestamp',
    name: 'last_payment_attempt_date',
    default: () => 'CURRENT_TIMESTAMP(6)',
    nullable: true,
  })
  lastPaymentAttemptDate: Date;

  @Column({ name: 'last_payment_attempt_result', type: 'varchar', length: 20, nullable: true })
  lastPaymentAttemptResult: string;

  @Column({
    type: 'timestamp',
    name: 'payment_initiated_at',
    nullable: true,
  })
  paymentInitiatedAt: Date;
}
