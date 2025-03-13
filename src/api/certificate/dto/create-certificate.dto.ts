import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDate } from 'class-validator';

export class CreateCertificateDto {
  @ApiProperty()
  @IsString()
  certificate_name: string;

  @ApiProperty()
  @IsString()
  issued_by: string;

  @ApiProperty()
  @IsDate()
  issue_date: Date;
}
