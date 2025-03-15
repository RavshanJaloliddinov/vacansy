import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CertificateService } from './certificate.service';
import { CreateCertificateDto } from './dto/create-certificate.dto';
import { UpdateCertificateDto } from './dto/update-certificate.dto';
import { CurrentUser } from 'src/common/decorator/current-user';
import { UserEntity } from 'src/core/entity';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth('access-token')
@ApiTags('Certificates')
@Controller('certificates')
export class CertificateController {
  constructor(private readonly certificateService: CertificateService) { }

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Yangi sertifikat yaratish' })
  async create(
    @Body() createCertificateDto: CreateCertificateDto,
    @UploadedFile() image: Express.Multer.File,
    @CurrentUser() user: UserEntity,
  ) {
    return this.certificateService.create(createCertificateDto, user, image);
  }

  @Get()
  @ApiOperation({ summary: 'Foydalanuvchining barcha sertifikatlarini olish' })
  @ApiResponse({ status: 200, description: 'Sertifikatlar ro‘yxati' })
  async findAll(@CurrentUser() user: UserEntity) {
    return this.certificateService.findAll(user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Bitta sertifikatni olish' })
  @ApiResponse({ status: 200, description: 'Topilgan sertifikat' })
  @ApiResponse({ status: 404, description: 'Sertifikat topilmadi' })
  async findOne(
    @Param('id') id: string,
    @CurrentUser() user: UserEntity,
  ) {
    return this.certificateService.findOne(id, user);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Sertifikatni yangilash' })
  async update(
    @Param('id') id: string,
    @Body() updateCertificateDto: UpdateCertificateDto,
    @UploadedFile() image: Express.Multer.File,
    @CurrentUser() user: UserEntity,
  ) {
    return this.certificateService.update(id, updateCertificateDto, user, image);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Sertifikatni o‘chirish' })
  @ApiResponse({ status: 200, description: 'Sertifikat muvaffaqiyatli o‘chirildi' })
  @ApiResponse({ status: 404, description: 'Sertifikat topilmadi' })
  async remove(@Param('id') id: string, @CurrentUser() user: UserEntity) {
    return this.certificateService.remove(id, user);
  }
}
