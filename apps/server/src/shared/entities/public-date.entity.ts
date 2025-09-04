import {
  BeforeInsert,
  BeforeUpdate,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export class PublicDate {
  @CreateDateColumn({
    type: 'timestamp',
    name: 'created_time',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdTime: Date;

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
