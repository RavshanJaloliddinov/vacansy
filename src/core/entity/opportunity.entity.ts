import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { OrganizationEntity } from './organization.entity';
import { BaseEntity } from 'src/common/database/BaseEntity';

@Entity()
export class OpportunityEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @ManyToOne(() => OrganizationEntity, (organization) => organization.opportunities, { onDelete: 'CASCADE' })
  organization: OrganizationEntity;
}