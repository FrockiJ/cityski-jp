import { UserDate } from 'src/shared/entities/user_date.entity';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Member extends UserDate {
  @PrimaryGeneratedColumn('uuid')
  id: string; // PK

  @Column({ type: 'varchar', unique: true })
  no: string; // 編號 (unique 8 digits)

  @Column({ type: 'varchar', length: 50 })
  name: string; // 姓名

  @Column({ type: 'char', length: 1 })
  type: string; // 註冊方式 (E: Email, L: Line)

  @Column({ type: 'varchar', length: 100, nullable: true, unique: true })
  email: string | null; // Email (nullable, unique)

  @Column({
    name: 'line_id',
    type: 'varchar',
    length: 255,
    nullable: true,
    unique: true,
  })
  lineId: string | null; // Line ID (nullable, unique)

  @Column({ type: 'varchar', length: 255, nullable: true })
  password: string | null; // 密碼 (nullable, only for email registration)

  @Column({ name: 'line_name', type: 'varchar', length: 100, nullable: true })
  lineName: string | null; // Line 名稱 (nullable)

  @Column({ name: 'line_oa', type: 'varchar', length: 255, nullable: true })
  lineOa: string | null; // Line OA ID (nullable)

  @Column({ type: 'varchar', length: 255, nullable: true })
  avatar: string | null; // 頭像 (nullable)

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string | null; // 電話號碼 (nullable)

  @Column({ type: 'integer', default: 1 })
  snowboard: number; // 單板等級 (預設 1)

  @Column({ type: 'integer', default: 1 })
  skis: number; // 雙板等級 (預設 1)

  // NOTE: dont use date-time for postgres
  @Column({ type: 'timestamp', nullable: true })
  birthday: Date | null; // 生日 (nullable)

  @Column({ type: 'text', nullable: true })
  note: string | null; // 備註 (nullable)

  @Column({ type: 'integer', default: 1 })
  status: number = 1; // 狀態 (0: 停用, 1: 啟用, 2: 未開通)

  @Column({ type: 'text', nullable: true })
  refresh: string;
}
