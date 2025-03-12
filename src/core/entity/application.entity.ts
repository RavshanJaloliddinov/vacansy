import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { UserEntity } from './user.entity';
import { OpportunityEntity } from './opportunity.entity';
import { BaseEntity } from 'src/common/database/BaseEntity';

@Entity()
export class ApplicationEntity extends BaseEntity {

  @ManyToOne(() => UserEntity, (user) => user.applications, { onDelete: 'CASCADE' })
  user: UserEntity;

  @ManyToOne(() => OpportunityEntity, { onDelete: 'CASCADE' })
  opportunity: OpportunityEntity;

  @Column({ type: 'enum', enum: ['pending', 'accepted', 'rejected'], default: 'pending' })
  status: 'pending' | 'accepted' | 'rejected';

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  applied_at: Date;
}
