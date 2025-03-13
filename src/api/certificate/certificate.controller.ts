import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { CertificateService } from './certificate.service';
import { CreateCertificateDto } from './dto/create-certificate.dto';
import { UpdateCertificateDto } from './dto/update-certificate.dto';
import { CurrentUser } from 'src/common/decorator/current-user';
import { UserEntity } from 'src/core/entity';

@Controller('certificates')
export class CertificateController {
  constructor(private readonly certificateService: CertificateService) { }

  @Post()
  async create(
    @Body() createCertificateDto: CreateCertificateDto,
    @CurrentUser() user: UserEntity,
  ) {
    return this.certificateService.create(createCertificateDto, user);
  }

  @Get()
  async findAll(@CurrentUser() user: UserEntity) {
    return this.certificateService.findAll(user);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @CurrentUser() user: UserEntity,
  ) {
    return this.certificateService.findOne(id, user);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCertificateDto: UpdateCertificateDto,
    @CurrentUser() user: UserEntity,
  ) {
    return this.certificateService.update(id, updateCertificateDto, user);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @CurrentUser() user: UserEntity) {
    return this.certificateService.remove(id, user);
  }
}
