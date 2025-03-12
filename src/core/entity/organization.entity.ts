import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm';
import { OpportunityEntity } from './opportunity.entity';
import { BaseEntity } from 'src/common/database/BaseEntity';
@Entity()
export class OrganizationEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 255 })
    name: string;

    @Column({ type: 'text' })
    description: string;

    @OneToMany(() => OpportunityEntity, (opportunity) => opportunity.organization)
    opportunities: OpportunityEntity[];
}