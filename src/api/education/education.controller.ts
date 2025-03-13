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
import { EducationService } from './education.service';
import { CreateEducationDto } from './dto/create-education.dto';
import { UpdateEducationDto } from './dto/update-education.dto';
import { CurrentUser } from 'src/common/decorator/current-user';
import { UserEntity } from 'src/core/entity';

@Controller('education')
export class EducationController {
  constructor(private readonly educationService: EducationService) {}

  @Post()
  async create(
    @Body() createEducationDto: CreateEducationDto,
    @CurrentUser() user: UserEntity,
  ) {
    return this.educationService.create(createEducationDto, user);
  }

  @Get()
  async findAll(@CurrentUser() user: UserEntity) {
    return this.educationService.findAll(user);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @CurrentUser() user: UserEntity,
  ) {
    return this.educationService.findOne(id, user);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateEducationDto: UpdateEducationDto,
    @CurrentUser() user: UserEntity,
  ) {
    return this.educationService.update(id, updateEducationDto, user);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @CurrentUser() user: UserEntity) {
    return this.educationService.remove(id, user);
  }
}
