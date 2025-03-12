import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { UserEntity } from './user.entity';
import { BaseEntity } from 'src/common/database/BaseEntity';

@Entity()
export class SkillEntity extends BaseEntity {


    @ManyToOne(() => UserEntity, (user) => user.skills, { onDelete: 'CASCADE' })
    user: UserEntity

    @Column({ length: 255 })
    skill_name: string;
}
