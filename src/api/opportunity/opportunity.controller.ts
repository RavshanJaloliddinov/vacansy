import { Controller, Post, Get, Patch, Delete, Body, Param } from '@nestjs/common';
import { OpportunityService } from './opportunity.service';
import { CreateOpportunityDto } from './dto/create-opportunity.dto';
import { CurrentUser } from 'src/common/decorator/current-user';
import { OrganizationEntity } from 'src/core/entity/organization.entity';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Opportunities')
@ApiBearerAuth('access-token')
@Controller('opportunities')
export class OpportunityController {
  constructor(private readonly opportunityService: OpportunityService) { }

  @ApiOperation({ summary: 'Create a new opportunity (Organization only)' })
  @ApiResponse({ status: 201, description: 'Opportunity created successfully' })
  @Post()
  async create(
    @Body() createOpportunityDto: CreateOpportunityDto,
    @CurrentUser() organization: OrganizationEntity,
  ) {
    return this.opportunityService.create(createOpportunityDto, organization);
  }

  @ApiOperation({ summary: 'Get opportunities by organization (Organization only)' })
  @ApiResponse({ status: 200, description: 'List of opportunities' })
  @Get()
  async findAllByOrganization(@CurrentUser() organization: OrganizationEntity) {
    return this.opportunityService.findAllByOrganization(organization.id);
  }

  @ApiOperation({ summary: 'Get opportunities by users' })
  @ApiResponse({ status: 200, description: 'List of opportunities' })
  @Get('all')
  async findAll() {
    return this.opportunityService.findAll();
  }

  @ApiOperation({ summary: 'Update an opportunity (Organization only)' })
  @ApiResponse({ status: 200, description: 'Opportunity updated successfully' })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() createOpportunityDto: CreateOpportunityDto,
    @CurrentUser() organization: OrganizationEntity,
  ) {
    return this.opportunityService.update(id, createOpportunityDto, organization.id);
  }

  @ApiOperation({ summary: 'Delete an opportunity (Organization only)' })
  @ApiResponse({ status: 200, description: 'Opportunity deleted successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Opportunity not found' })
  @Delete(':id')
  async delete(
    @Param('id') id: string,
    @CurrentUser() organization: OrganizationEntity,
  ) {
    return this.opportunityService.delete(id, organization.id);
  }
}
