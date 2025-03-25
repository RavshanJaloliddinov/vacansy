import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OpportunityEntity } from 'src/core/entity/opportunity.entity';
import { CreateOpportunityDto } from './dto/create-opportunity.dto';
import { OrganizationEntity } from 'src/core/entity/organization.entity';
import { FilterDto } from 'src/infrastructure/query/dto/filter.dto';
import { PaginationDto } from 'src/infrastructure/query/dto/pagination.dto';
import { QueryHelperService } from 'src/infrastructure/query/query-helper';
import { FileService } from 'src/infrastructure/file';

@Injectable()
export class OpportunityService {
  constructor(
    @InjectRepository(OpportunityEntity)
    private readonly opportunityRepository: Repository<OpportunityEntity>,
    @InjectRepository(OrganizationEntity)
    private readonly organizationRepository: Repository<OrganizationEntity>,
    private readonly fileService: FileService
  ) { }
 

  async create(
    createOpportunityDto: CreateOpportunityDto,
    organization: OrganizationEntity,
    imageFile?: Express.Multer.File
  ): Promise<OpportunityEntity> {
    const org = await this.organizationRepository.findOne({ where: { id: organization.id } });

    if (!org) {
      throw new NotFoundException('Organization not found');
    }

    let imageFileName: string | null = null;

    if (imageFile) {
      imageFileName = await this.fileService.saveFile(imageFile);
    }

    const opportunity = this.opportunityRepository.create({
      ...createOpportunityDto,
      organization,
      image: imageFileName,
    });

    return await this.opportunityRepository.save(opportunity);
  }



  async findAllByOrganization(
    organizationId: string,
    paginationDto: PaginationDto,
    filterDto?: FilterDto
  ): Promise<any> {
    const queryBuilder = this.opportunityRepository
      .createQueryBuilder('opportunity')
      .where('opportunity.organizationId = :organizationId', { organizationId });

    const searchFields = ['opportunity.title', 'opportunity.description'];

    return await QueryHelperService.paginateAndFilter(queryBuilder, paginationDto, filterDto, searchFields);
  }

  async findAll(paginationDto: PaginationDto, filterDto?: FilterDto): Promise<any> {
    const queryBuilder = this.opportunityRepository.createQueryBuilder('opportunity');

    const searchFields = ['opportunity.title', 'opportunity.description'];

    return await QueryHelperService.paginateAndFilter(queryBuilder, paginationDto, filterDto, searchFields);
  }


  async update(
    id: string,
    createOpportunityDto: CreateOpportunityDto,
    organizationId: string,
    imageFile: Express.Multer.File
  ): Promise<OpportunityEntity> {
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

    let imageFileName = opportunity.image;

    if (imageFile) {
      if (opportunity.image) {
        await this.fileService.deleteFile(opportunity.image);
      }

      imageFileName = await this.fileService.saveFile(imageFile);
    }

    Object.assign(opportunity, createOpportunityDto, { image: imageFileName });

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
