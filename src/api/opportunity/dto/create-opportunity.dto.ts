import { IsString, IsEnum, IsOptional } from 'class-validator';
import { OpportunityType, ExperienceLevel, Category, PaymentType } from 'src/common/database/Enum';

export class CreateOpportunityDto {
    @IsString()
    name: string;

    @IsString()
    description: string;

    @IsString()
    location: string;

    @IsEnum(OpportunityType)
    opportunityType: OpportunityType;

    @IsEnum(ExperienceLevel)
    experienceLevel: ExperienceLevel;

    @IsEnum(Category)
    category: Category;

    @IsEnum(PaymentType)
    @IsOptional()
    paymentType?: PaymentType;
}
