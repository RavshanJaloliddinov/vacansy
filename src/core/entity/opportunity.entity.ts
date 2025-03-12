import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Organization } from './organization.entity';
import { BaseEntity } from 'src/common/database/BaseEntity';

@Entity()
export class Opportunity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @ManyToOne(() => Organization, (organization) => organization.opportunities, { onDelete: 'CASCADE' })
  organization: Organization;
}