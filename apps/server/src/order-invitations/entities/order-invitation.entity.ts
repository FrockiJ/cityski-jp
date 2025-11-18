import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Order } from 'src/orders/entities/order.entity';
import { Member } from 'src/members/entities/member.entity';
import { UserDate } from 'src/shared/entities/user_date.entity';

export enum OrderInvitationStatus {
  PENDING = 0,
  REDEEMED = 1,
  EXPIRED = 2,
  CANCELLED = 3,
}

export enum InviteeType {
  ADULT = 'adult',
  CHILD = 'child',
}

@Entity('order_invitations')
export class OrderInvitation extends UserDate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'order_id', type: 'uuid' })
  orderId: string;

  @Column({ name: 'inviter_user_id', type: 'uuid' })
  inviterUserId: string;

  @Column({ name: 'invite_token', type: 'varchar', unique: true, length: 255 })
  inviteToken: string;

  @Column({ type: 'smallint', default: OrderInvitationStatus.PENDING })
  status: OrderInvitationStatus;

  @CreateDateColumn({
    type: 'timestamp',
    name: 'expires_at',
  })
  expiresAt: Date;

  @Column({
    name: 'redeemed_by_user_id',
    type: 'uuid',
    nullable: true,
  })
  redeemedByUserId: string;

  @CreateDateColumn({
    type: 'timestamp',
    name: 'redeemed_at',
    nullable: true,
  })
  redeemedAt: Date;

  @Column({
    name: 'invitee_type',
    type: 'varchar',
    length: 10,
  })
  inviteeType: InviteeType;

  // Relations
  @ManyToOne(() => Order, (order) => order.orderInvitations)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @ManyToOne(() => Member)
  @JoinColumn({ name: 'inviter_user_id' })
  inviter: Member;

  @ManyToOne(() => Member, { nullable: true })
  @JoinColumn({ name: 'redeemed_by_user_id' })
  redeemedBy: Member;
}
