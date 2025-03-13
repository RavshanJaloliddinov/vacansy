import { Entity, Column, OneToMany } from 'typeorm';
import { ApplicationEntity } from './application.entity';
import { SkillEntity } from './skill.entity';
import { CertificateEntity } from './certificate.entity';
import { EducationEntity } from './education.entity';
import { ContributionHistoryEntity } from './contribution-history.entity';
import { BaseEntity } from 'src/common/database/BaseEntity';
import { UserRoles } from 'src/common/database/Enum';

@Entity()
export class UserEntity extends BaseEntity {

  @Column({ length: 255 })
  name: string;

  @Column({ length: 255 })
  email: string;

  @Column({ length: 255 })
  password: string;

  @Column({ nullable: true })
  image: string

  @Column({ type: 'enum', enum: UserRoles, default: 'user' })
  role: UserRoles;

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
}
