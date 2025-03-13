import { ApiProperty } from '@nestjs/swagger';

export class CreateOrganizationDto {
    @ApiProperty({
        description: 'The name of the organization',
        type: String,
        example: 'Tech Corp',
    })
    name: string;

    @ApiProperty({
        description: 'A brief description of the organization',
        type: String,
        example: 'A leading tech company providing innovative solutions',
    })
    description: string;
}
