import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { OrganizationEntity } from "./organization.entity";
import { BaseEntity } from "src/common/database/BaseEntity";

@Entity()
export class SubscriptionEntity extends BaseEntity {

    @ManyToOne(() => OrganizationEntity)
    @JoinColumn({ name: 'organization_id' })
    organization: OrganizationEntity;

    @Column({ type: 'enum', enum: ['basic', 'premium', 'enterprise'] })
    plan_type: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    price: number;

    @Column({ type: 'timestamp' })
    start_date: Date;

    @Column({ type: 'timestamp' })
    end_date: Date;

    @Column({ type: 'enum', enum: ['active', 'expired', 'canceled'], default: 'active' })
    status: string;
}