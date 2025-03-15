import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrganizationEntity } from 'src/core/entity';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { UserEntity } from 'src/core/entity/user.entity'; 

@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(OrganizationEntity)
    private readonly organizationRepository: Repository<OrganizationEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}


  async create(createOrganizationDto: CreateOrganizationDto, currentUserId: string): Promise<any> {
    try {
      const user = await this.userRepository.findOne({ where: { id: currentUserId } });

      if (!user) {
        return { status: 'error', data: null, message: 'User not found' };
      }

      const organization = this.organizationRepository.create(createOrganizationDto);
      organization.created_by = currentUserId;
      await this.organizationRepository.save(organization);

      console.log(`${currentUserId} created a new organization: ${organization.name}`);

      return { status: 'success', data: organization, message: 'Organization successfully created' };
    } catch (error) {
      return { status: 'error', data: null, message: error.message };
    }
  }

  // Update organization
  async update(id: string, updateOrganizationDto: UpdateOrganizationDto, currentUserId: string): Promise<any> {
    try {
      const organization = await this.organizationRepository.findOne({ where: { id } });

      if (!organization) {
        return { status: 'error', data: null, message: 'Organization not found' };
      }

      // Update the organization
      await this.organizationRepository.update(id, {
        ...updateOrganizationDto,
        updated_by: currentUserId,
      });

      const updatedOrganization = await this.organizationRepository.findOne({ where: { id } });

      // Log the update
      console.log(`${currentUserId} updated organization: ${updatedOrganization.name}`);

      return { status: 'success', data: updatedOrganization, message: 'Organization successfully updated' };
    } catch (error) {
      return { status: 'error', data: null, message: error.message };
    }
  }

  // Remove organization (soft delete)
  async remove(id: string, currentUserId: string): Promise<any> {
    try {
      const organization = await this.organizationRepository.findOne({ where: { id } });

      if (!organization) {
        return { status: 'error', data: null, message: 'Organization not found' };
      }

      organization.deleted_at = new Date();
      organization.deleted_by = currentUserId;
      organization.is_deleted = true;

      await this.organizationRepository.save(organization);

      // Log the deletion
      console.log(`${currentUserId} soft-deleted organization: ${organization.name}`);

      return { status: 'success', data: null, message: 'Organization successfully soft-deleted' };
    } catch (error) {
      return { status: 'error', data: null, message: error.message };
    }
  }

  // Get organization by ID
  async findOne(id: string): Promise<any> {
    try {
      const organization = await this.organizationRepository.findOne({ where: { id } });
      if (!organization) {
        return { status: 'error', data: null, message: 'Organization not found' };
      }
      return { status: 'success', data: organization, message: 'Organization retrieved successfully' };
    } catch (error) {
      return { status: 'error', data: null, message: error.message };
    }
  }

  // Get all organizations
  async findAll(): Promise<any> {
    try {
      const organizations = await this.organizationRepository.find();
      return { status: 'success', data: organizations, message: 'Organizations retrieved successfully' };
    } catch (error) {
      return { status: 'error', data: null, message: error.message };
    }
  }
}
