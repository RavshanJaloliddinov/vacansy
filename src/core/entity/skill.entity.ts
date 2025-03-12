import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { BaseEntity } from 'src/common/database/BaseEntity';

@Entity()
export class Skill extends BaseEntity {


    @ManyToOne(() => User, (user) => user.skills, { onDelete: 'CASCADE' })
    user: User;

    @Column({ length: 255 })
    skill_name: string;
}
