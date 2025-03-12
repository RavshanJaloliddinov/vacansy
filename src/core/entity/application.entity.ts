import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { Opportunity } from './opportunity.entity';
import { BaseEntity } from 'src/common/database/BaseEntity';

@Entity()
export class Application extends BaseEntity {

  @ManyToOne(() => User, (user) => user.applications, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Opportunity, { onDelete: 'CASCADE' })
  opportunity: Opportunity;

  @Column({ type: 'enum', enum: ['pending', 'accepted', 'rejected'], default: 'pending' })
  status: 'pending' | 'accepted' | 'rejected';

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  applied_at: Date;
}
