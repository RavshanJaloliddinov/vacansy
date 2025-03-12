import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { BaseEntity } from 'src/common/database/BaseEntity';

@Entity()
export class Education extends BaseEntity{

  @ManyToOne(() => User, (user) => user.education, { onDelete: 'CASCADE' })
  user: User;

  @Column({ length: 255 })
  institution: string;

  @Column({ length: 255 })
  degree: string;

  @Column({ length: 255 })
  field_of_study: string;

  @Column({ type: 'timestamp' })
  start_date: Date;

  @Column({ type: 'timestamp', nullable: true })
  end_date: Date;
}
