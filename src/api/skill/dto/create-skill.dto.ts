import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateSkillDto {
  @ApiProperty({
    description: 'The name of the skill',
    example: 'JavaScript',
  })
  @IsString()
  skill_name: string;
}
