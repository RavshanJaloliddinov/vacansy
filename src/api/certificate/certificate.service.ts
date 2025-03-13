import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CertificateEntity } from 'src/core/entity';
import { CreateCertificateDto } from './dto/create-certificate.dto';
import { UpdateCertificateDto } from './dto/update-certificate.dto';
import { UserEntity } from 'src/core/entity';

@Injectable()
export class CertificateService {
  constructor(
    @InjectRepository(CertificateEntity)
    private readonly certificateRepository: Repository<CertificateEntity>,
  ) { }

  async create(
    createCertificateDto: CreateCertificateDto,
    user: UserEntity,
  ): Promise<CertificateEntity> {
    const certificate = this.certificateRepository.create({
      ...createCertificateDto,
      user, // Sertifikatni foydalanuvchiga bog'lash
    });

    return await this.certificateRepository.save(certificate);
  }

  async findAll(user: UserEntity): Promise<CertificateEntity[]> {
    return await this.certificateRepository.find({ where: { user } });
  }

  async findOne(id: string, user: UserEntity): Promise<CertificateEntity> {
    const certificate = await this.certificateRepository.findOne({
      where: { id, user },
    });

    if (!certificate) {
      throw new NotFoundException('Certificate not found');
    }

    return certificate;
  }

  async update(
    id: string,
    updateCertificateDto: UpdateCertificateDto,
    user: UserEntity,
  ): Promise<CertificateEntity> {
    const certificate = await this.findOne(id, user);

    if (!certificate) {
      throw new NotFoundException('Certificate not found');
    }

    const updatedCertificate = await this.certificateRepository.save({
      ...certificate,
      ...updateCertificateDto,
    });

    return updatedCertificate;
  }

  async remove(id: string, user: UserEntity): Promise<void> {
    const certificate = await this.findOne(id, user);

    if (!certificate) {
      throw new NotFoundException('Certificate not found');
    }

    await this.certificateRepository.remove(certificate);
  }
}
