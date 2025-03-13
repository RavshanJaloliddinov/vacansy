import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDate, IsOptional } from 'class-validator';

export class CreateEducationDto {
  @ApiProperty({
    description: 'The name of the institution where the user studied.',
    example: 'Harvard University',
  })
  @IsString()
  institution: string;

  @ApiProperty({
    description: 'The degree obtained by the user.',
    example: 'Bachelor of Science',
  })
  @IsString()
  degree: string;

  @ApiProperty({
    description: 'The field of study of the user.',
    example: 'Computer Science',
  })
  @IsString()
  field_of_study: string;

  @ApiProperty({
    description: 'The start date of the education.',
    example: '2020-01-01',
  })
  @IsDate()
  start_date: Date;

  @ApiProperty({
    description: 'The end date of the education (optional).',
    example: '2024-05-15',
    required: false,
  })
  @IsOptional()
  @IsDate()
  end_date?: Date;
}
