import { Module } from '@nestjs/common';
import { OpportunityService } from './opportunity.service';
import { OpportunityController } from './opportunity.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicationEntity, OpportunityEntity, OrganizationEntity } from 'src/core/entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([OpportunityEntity, ApplicationEntity, OrganizationEntity])
  ],
  controllers: [OpportunityController],
  providers: [OpportunityService],
})
export class OpportunityModule { }
