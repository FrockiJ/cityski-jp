import { PublicDate } from 'src/shared/entities/public-date.entity';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class File extends PublicDate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'media_type', type: 'varchar', length: 10 })
  mediaType: string;

  @Column({ name: 'device_type', type: 'varchar', length: 1 })
  deviceType: string;

  @Column({ name: 'file_url', type: 'text' })
  fileUrl: string;

  @Column({ name: 'original_name', type: 'varchar', length: 50 })
  originalName: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'int' })
  sequence: number;

  @Column({ name: 'table_name', type: 'text' })
  tableName: string;

  @Column({ name: 'table_id', type: 'uuid' })
  tableId: string;

  // cascade 刪除homeBanner會連動刪除關聯不需另外刪除
  // @ManyToOne(() => HomeBanner, (homeBanner) => homeBanner.files, {
  //   onDelete: 'CASCADE',
  // })
  // @JoinColumn({ name: 'table_id' })
  // homeBanner: HomeBanner;
}
