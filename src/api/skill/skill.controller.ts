import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { SkillService } from './skill.service';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { CurrentUser } from 'src/common/decorator/current-user';
import { UserEntity } from 'src/core/entity';

@Controller('skills')
export class SkillController {
  constructor(private readonly skillService: SkillService) { }

  @Post()
  async create(
    @Body() createSkillDto: CreateSkillDto,
    @CurrentUser() user: UserEntity,
  ) {
    return this.skillService.create(createSkillDto, user);
  }

  @Get()
  async findAll(@CurrentUser() user: UserEntity) {
    return this.skillService.findAll(user);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @CurrentUser() user: UserEntity,
  ) {
    return this.skillService.findOne(id, user);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateSkillDto: UpdateSkillDto,
    @CurrentUser() user: UserEntity,
  ) {
    return this.skillService.update(id, updateSkillDto, user);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @CurrentUser() user: UserEntity) {
    return this.skillService.remove(id, user);
  }
}
