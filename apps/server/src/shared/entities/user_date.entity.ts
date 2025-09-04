import {
  Entity,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';

@Entity()
export class UserDate {
  @Column({
    name: 'created_user',
    type: 'uuid',
    unique: false,
    nullable: true,
  })
  createdUser: string;

  @CreateDateColumn({
    type: 'timestamp',
    name: 'created_time',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdTime: Date;

  @Column({
    name: 'updated_user',
    type: 'uuid',
    unique: false,
    nullable: true,
  })
  updatedUser: string;

  @UpdateDateColumn({
    type: 'timestamp',
    name: 'updated_time',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  updatedTime: Date;

  @BeforeInsert()
  create() {
    this.createdTime = new Date();
    this.updatedTime = new Date();
  }

  @BeforeUpdate()
  update() {
    this.updatedTime = new Date();
  }
}
