import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { UserEntity } from './user.entity';
import { BaseEntity } from 'src/common/database/BaseEntity';

@Entity()
export class EducationEntity extends BaseEntity{

  @ManyToOne(() => UserEntity, (user) => user.education, { onDelete: 'CASCADE' })
  user: UserEntity

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
