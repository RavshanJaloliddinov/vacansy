import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EducationEntity } from 'src/core/entity';
import { CreateEducationDto } from './dto/create-education.dto';
import { UpdateEducationDto } from './dto/update-education.dto';
import { UserEntity } from 'src/core/entity';

@Injectable()
export class EducationService {
  constructor(
    @InjectRepository(EducationEntity)
    private readonly educationRepository: Repository<EducationEntity>,
  ) {}

  // Yangi ta'lim ma'lumotlarini yaratish
  async create(
    createEducationDto: CreateEducationDto,
    user: UserEntity,
  ): Promise<EducationEntity> {
    const education = this.educationRepository.create({
      ...createEducationDto,
      user, // Foydalanuvchini ta'lim bilan bog'lash
    });

    return await this.educationRepository.save(education);
  }

  // Foydalanuvchining barcha ta'lim ma'lumotlarini olish
  async findAll(user: UserEntity): Promise<EducationEntity[]> {
    return await this.educationRepository.find({ where: { user } });
  }

  // Foydalanuvchining ma'lum bir ta'lim ma'lumotini olish
  async findOne(id: string, user: UserEntity): Promise<EducationEntity> {
    const education = await this.educationRepository.findOne({
      where: { id, user },
    });

    if (!education) {
      throw new NotFoundException('Education not found');
    }

    return education;
  }

  // Ta'lim ma'lumotlarini yangilash
  async update(
    id: string,
    updateEducationDto: UpdateEducationDto,
    user: UserEntity,
  ): Promise<EducationEntity> {
    const education = await this.findOne(id, user);

    if (!education) {
      throw new NotFoundException('Education not found');
    }

    const updatedEducation = await this.educationRepository.save({
      ...education,
      ...updateEducationDto,
    });

    return updatedEducation;
  }

  // Ta'lim ma'lumotlarini o'chirish
  async remove(id: string, user: UserEntity): Promise<void> {
    const education = await this.findOne(id, user);

    if (!education) {
      throw new NotFoundException('Education not found');
    }

    await this.educationRepository.remove(education);
  }
}
