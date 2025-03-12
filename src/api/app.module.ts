import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from 'src/config';
import { AdminEntity, ApplicationEntity, CertificateEntity, ContributionHistoryEntity, EducationEntity, OpportunityEntity, OrganizationEntity, SkillEntity, SubscriptionEntity, UserEntity } from 'src/core/entity';
import { AuthModule } from './auth/auth.module';
import { MailModule } from 'src/infrastructure/mail/mail.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: config.DB_URL,
      synchronize: true,
      entities: [UserEntity, AdminEntity, ApplicationEntity, CertificateEntity, ContributionHistoryEntity, EducationEntity, OpportunityEntity, OrganizationEntity, SkillEntity, SubscriptionEntity],
      ssl: false
    }), 
    AuthModule,
    MailModule,
  ],
  providers: [],
})
export class AppModule { }
