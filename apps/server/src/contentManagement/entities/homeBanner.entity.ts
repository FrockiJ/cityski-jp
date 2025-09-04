import { UserDate } from 'src/shared/entities/user_date.entity';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class HomeBanner extends UserDate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'button_url', type: 'varchar', length: 100, nullable: true })
  buttonUrl: string;

  // cascade: true save時可以將關聯資料寫在一起儲存
  // @OneToMany(() => File, (file) => file.homeBanner, {
  //   cascade: true,
  // })
  // files: File[];
}
