import { Entity, PrimaryGeneratedColumn, Column, OneToMany  } from 'typeorm';
import { Application } from './application.entity';
import { Skill } from './skill.entity';
import { Certificate } from './certificate.entity';
import { Education } from './education.entity';
import { ContributionHistory } from './contribution-history.entity';
import { Admin } from './admin.entity';
import { BaseEntity } from 'src/common/database/BaseEntity';

@Entity()
export class User extends BaseEntity {

  @Column({ length: 255 })
  name: string;

  @Column({ length: 255, unique: true })
  email: string;

  @Column({ length: 255 })
  password: string;

  @Column({ length: 20 })
  phone: string;

  @Column({ type: 'enum', enum: ['user', 'admin'], default: 'user' })
  role: 'user' | 'admin';

  @OneToMany(() => Application, (application) => application.user)
  applications: Application[];

  @OneToMany(() => Skill, (skill) => skill.user)
  skills: Skill[];

  @OneToMany(() => Certificate, (certificate) => certificate.user)
  certificates: Certificate[];

  @OneToMany(() => Education, (education) => education.user)
  education: Education[];

  @OneToMany(() => ContributionHistory, (contribution) => contribution.user)
  contributions: ContributionHistory[];

  @OneToMany(() => Admin, (admin) => admin.user)
  adminRoles: Admin[];
}
