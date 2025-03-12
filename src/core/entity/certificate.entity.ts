import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { BaseEntity } from 'src/common/database/BaseEntity';

@Entity()
export class Certificate extends BaseEntity{
  @ManyToOne(() => User, (user) => user.certificates, { onDelete: 'CASCADE' })
  user: User;

  @Column({ length: 255 })
  certificate_name: string;

  @Column({ length: 255 })
  issued_by: string;

  @Column({ type: 'timestamp' })
  issue_date: Date;
}
