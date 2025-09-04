import { UserDate } from 'src/shared/entities/user_date.entity';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class HomeVideo extends UserDate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 200 })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  url: string;

  @Column({ name: 'button_name', type: 'varchar', length: 20 })
  buttonName: string;

  @Column({ name: 'button_url', type: 'varchar', length: 100 })
  buttonUrl: string;

  @Column({ type: 'int' })
  sort: number;
}
