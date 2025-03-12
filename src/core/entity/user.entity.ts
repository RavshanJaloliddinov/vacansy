import { Entity, PrimaryGeneratedColumn, Column, OneToMany  } from 'typeorm';
import { ApplicationEntity } from './application.entity';
import { SkillEntity } from './skill.entity';
import { CertificateEntity } from './certificate.entity';
import { EducationEntity } from './education.entity';
import { ContributionHistoryEntity } from './contribution-history.entity';
import { AdminEntity } from './admin.entity';
import { BaseEntity } from 'src/common/database/BaseEntity';

@Entity()
export class UserEntity extends BaseEntity {

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

  @OneToMany(() => ApplicationEntity, (application) => application.user)
  applications: ApplicationEntity[];

  @OneToMany(() => SkillEntity, (skill) => skill.user)
  skills: SkillEntity[];

  @OneToMany(() => CertificateEntity, (certificate) => certificate.user)
  certificates: CertificateEntity[];

  @OneToMany(() => EducationEntity, (education) => education.user)
  education: EducationEntity[];

  @OneToMany(() => ContributionHistoryEntity, (contribution) => contribution.user)
  contributions: ContributionHistoryEntity[];

  @OneToMany(() => AdminEntity, (admin) => admin.user)
  adminRoles: AdminEntity[];
}
