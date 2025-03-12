import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm';
import { Opportunity } from './opportunity.entity';
import { BaseEntity } from 'src/common/database/BaseEntity';
@Entity()
export class Organization extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 255 })
    name: string;

    @Column({ type: 'text' })
    description: string;

    @OneToMany(() => Opportunity, (opportunity) => opportunity.organization)
    opportunities: Opportunity[];
}