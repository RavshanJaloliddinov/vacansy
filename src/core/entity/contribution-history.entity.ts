import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Organization } from "./organization.entity";
import { User } from "./user.entity";
import { BaseEntity } from "src/common/database/BaseEntity";

@Entity()
export class ContributionHistory extends BaseEntity {

    @ManyToOne(() => Organization)
    @JoinColumn({ name: 'organization_id' })
    organization: Organization;

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

    @ManyToOne(() => User, (user) => user.id)
    user: User;
}