import { Module } from '@nestjs/common';
import { CertificateService } from './certificate.service';
import { CertificateController } from './certificate.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CertificateEntity, UserEntity } from 'src/core/entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CertificateEntity, UserEntity])
  ],
  controllers: [CertificateController],
  providers: [CertificateService],
})
export class CertificateModule { }
