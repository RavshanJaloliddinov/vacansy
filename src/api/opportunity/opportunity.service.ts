import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OpportunityEntity } from 'src/core/entity/opportunity.entity';
import { CreateOpportunityDto } from './dto/create-opportunity.dto';
import { OrganizationEntity } from 'src/core/entity/organization.entity';

@Injectable()
export class OpportunityService {
  constructor(
    @InjectRepository(OpportunityEntity)
    private readonly opportunityRepository: Repository<OpportunityEntity>,
    @InjectRepository(OrganizationEntity)
    private readonly organizationRepository: Repository<OrganizationEntity>,
  ) { }


  async create(createOpportunityDto: CreateOpportunityDto, organization: OrganizationEntity): Promise<OpportunityEntity> {
    const org = await this.organizationRepository.findOne({ where: { id: organization.id } })
    if (!org) {
      throw new NotFoundException('Organization not found')
    }

    const opportunity = this.opportunityRepository.create({
      ...createOpportunityDto,
      organization,
    });

    return await this.opportunityRepository.save(opportunity);
  }


  async findAllByOrganization(organizationId: string): Promise<OpportunityEntity[]> {
    return await this.opportunityRepository.find({
      where: { organization: { id: organizationId } },
    });
  }
  async findAll(): Promise<OpportunityEntity[]> {
    return await this.opportunityRepository.find();
  }


  async update(id: string, createOpportunityDto: CreateOpportunityDto, organizationId: string): Promise<OpportunityEntity> {
    const opportunity = await this.opportunityRepository.findOne({
      where: { id, organization: { id: organizationId } },
      relations: ['organization'],
    });

    if (!opportunity) {
      throw new NotFoundException('Opportunity not found');
    }

    if (opportunity.organization.id !== organizationId) {
      throw new ForbiddenException('You are not allowed to update this opportunity');
    }

    Object.assign(opportunity, createOpportunityDto);
    return await this.opportunityRepository.save(opportunity);
  }


  async delete(id: string, organizationId: string): Promise<void> {
    const opportunity = await this.opportunityRepository.findOne({
      where: { id, organization: { id: organizationId } },
      relations: ['organization'],
    });

    if (!opportunity) {
      throw new NotFoundException('Opportunity not found');
    }

    opportunity.deleted_at = new Date(); 
    opportunity.deleted_by = organizationId;
    opportunity.is_deleted = true;

    await this.organizationRepository.save(opportunity);

    await this.opportunityRepository.remove(opportunity);
  }
}
