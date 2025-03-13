import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from 'src/config';
import { ApplicationEntity, CertificateEntity, ContributionHistoryEntity, EducationEntity, OpportunityEntity, OrganizationEntity, SkillEntity, SubscriptionEntity, UserEntity } from 'src/core/entity';
import { AuthModule } from './auth/auth.module';
import { MailModule } from 'src/infrastructure/mail/mail.module';
import { UserModule } from './user/user.module';
import { JwtStrategy } from './auth/users/AuthStrategy';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/users/AuthGuard';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: config.DB_URL,
      synchronize: true,
      entities: [UserEntity, ApplicationEntity, CertificateEntity, ContributionHistoryEntity, EducationEntity, OpportunityEntity, OrganizationEntity, SkillEntity, SubscriptionEntity],
      ssl: false
    }),
    AuthModule,
    MailModule,
    UserModule,
  ],
  providers: [
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule { }
