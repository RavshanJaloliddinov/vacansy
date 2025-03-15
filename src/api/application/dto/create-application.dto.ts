import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ApplicationStatus } from 'src/common/database/Enum';

export class CreateApplicationDto {
    @ApiProperty({ example: 'uuid', description: 'Opportunity ID' })
    @IsNotEmpty()
    opportunityId: string;

    @ApiProperty({
        example: ApplicationStatus.PENDING,
        description: 'Application status',
        enum: ApplicationStatus,
        default: ApplicationStatus.PENDING,
    })
    @IsEnum(ApplicationStatus)
    status: ApplicationStatus;
}
