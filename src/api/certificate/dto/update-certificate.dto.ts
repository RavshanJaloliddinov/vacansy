import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsDate } from 'class-validator';

export class UpdateCertificateDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  certificate_name?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  issued_by?: string;

  @ApiProperty()
  @IsDate()
  @IsOptional()
  issue_date?: Date;
}
