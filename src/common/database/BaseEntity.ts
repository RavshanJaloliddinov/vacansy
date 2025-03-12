import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string

    @Column({
        name: 'is_active',
        type: 'boolean',
        default: true,
    })
    is_active: boolean;

    @Column({
        name: 'is_deleted',
        type: 'boolean',
        default: false,
    })
    is_deleted: boolean;

    @Column()
    created_at: number;

    @Column()
    updated_at: number;

    @Column()
    deleted_at: number;

    @Column()
    creted_by: string;

    @Column()
    updated_by: string;

    @Column()
    deleted_by: string;
}