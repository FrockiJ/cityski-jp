import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  BeforeInsert,
} from 'typeorm';

@Entity('verification_codes')
export class VerificationCode {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 15, nullable: false })
  phoneNumber: string; // User's phone number

  @Column({ type: 'varchar', length: 6, nullable: false })
  code: string; // The generated verification code

  @Column({
    type: 'timestamp',
    name: 'expire_time',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  expireTime: Date; // Expiration timestamp

  @CreateDateColumn({
    type: 'timestamp',
    name: 'created_time',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdTime: Date; // Record creation timestamp

  @BeforeInsert()
  create() {
    this.createdTime = new Date();
    console.log('createdTime', this.createdTime);
  }
}
