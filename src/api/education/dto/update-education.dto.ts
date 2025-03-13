import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDate, IsOptional } from 'class-validator';

export class UpdateEducationDto {
  @ApiProperty({
    description: 'The name of the institution where the user studied.',
    example: 'MIT',
    required: false,
  })
  @IsString()
  @IsOptional()
  institution?: string;

  @ApiProperty({
    description: 'The degree obtained by the user.',
    example: 'Master of Science',
    required: false,
  })
  @IsString()
  @IsOptional()
  degree?: string;

  @ApiProperty({
    description: 'The field of study of the user.',
    example: 'Artificial Intelligence',
    required: false,
  })
  @IsString()
  @IsOptional()
  field_of_study?: string;

  @ApiProperty({
    description: 'The start date of the education.',
    example: '2018-08-01',
    required: false,
  })
  @IsDate()
  @IsOptional()
  start_date?: Date;

  @ApiProperty({
    description: 'The end date of the education.',
    example: '2022-06-01',
    required: false,
  })
  @IsDate()
  @IsOptional()
  end_date?: Date;
}
