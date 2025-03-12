import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { BaseEntity } from 'src/common/database/BaseEntity';

@Entity()
export class Admin extends BaseEntity {

  @ManyToOne(() => User, (user) => user.adminRoles, { onDelete: 'CASCADE' })
  user: User;

  @Column({ type: 'enum', enum: ['super_admin', 'moderator'], default: 'moderator' })
  role: 'super_admin' | 'moderator';
}
