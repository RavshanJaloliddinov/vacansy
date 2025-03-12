import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { UserEntity } from './user.entity';
import { BaseEntity } from 'src/common/database/BaseEntity';

@Entity()
export class CertificateEntity extends BaseEntity{
  @ManyToOne(() => UserEntity, (user) => user.certificates, { onDelete: 'CASCADE' })
  user: UserEntity;

  @Column({ length: 255 })
  certificate_name: string;

  @Column({ length: 255 })
  issued_by: string;

  @Column({ type: 'timestamp' })
  issue_date: Date;
}
