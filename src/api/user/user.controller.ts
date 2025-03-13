import { Controller, Get, Param, Put, Body, Delete, Patch, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { UserEntity } from 'src/core/entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { CurrentUser } from 'src/common/decorator/current-user';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiBearerAuth('access-token')
@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post('create/:id')
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User successfully created', type: UserEntity })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiConsumes('multipart/form-data') // Specify that this endpoint accepts multipart/form-data
  @UseInterceptors(FileInterceptor('image')) // Handle file upload

  async createUser(
    @UploadedFile() imageFile: Express.Multer.File,
    @CurrentUser() user: UserEntity,
    @Body() createUserDto: CreateUserDto,
  ) {
    return this.userService.create(createUserDto, user.id, imageFile);
  }

  @Get('get/all') 
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully', type: [UserEntity] })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getAllUsers(@CurrentUser() user: UserEntity) {
    return this.userService.findAll();
  }

  @Patch('update/:id')
  @ApiOperation({ summary: 'Update user details' })
  @UseInterceptors(FileInterceptor('image')) // Handle file upload
  @ApiResponse({ status: 200, description: 'User successfully updated', type: UserEntity })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiConsumes('multipart/form-data') // Specify that this endpoint accepts multipart/form-data
  @ApiBody({
    description: 'Update user details and upload an image',
    type: UpdateUserDto, // The data structure for the update
  })
  async updateUsers(
    @Param('id') id: string,
    @CurrentUser() user: UserEntity,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() imageFile: Express.Multer.File, // Uploaded file will be available here
  ) {
    return this.userService.update(id, updateUserDto, user.id, imageFile);
  }

  @Delete('remove/:id')
  @ApiOperation({ summary: 'Delete a user' })
  @ApiResponse({ status: 200, description: 'User successfully removed' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async deleteUser(
    @Param('id') id: string,
    @CurrentUser() user: UserEntity,
  ) {
    return this.userService.remove(id, user.id);
  }

  @Get('me')
  @ApiOperation({ summary: 'Get profile of the currently logged-in user' })
  @ApiResponse({ status: 200, description: 'User profile retrieved successfully', type: UserEntity })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getProfile(@CurrentUser() user: UserEntity) {
    return this.userService.findOneWithRelations(user.id);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Update profile of the currently logged-in user' })
  @ApiResponse({ status: 200, description: 'Profile successfully updated', type: UserEntity })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiConsumes('multipart/form-data') // Specify that this endpoint accepts multipart/form-data
  @ApiBody({
    description: 'Update current user profile and upload an image',
    type: UpdateUserDto, // The data structure for the update
  })
  @UseInterceptors(FileInterceptor('image')) // Handle file upload
  async updateProfile(
    @CurrentUser() user: UserEntity,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() imageFile: Express.Multer.File, // Uploaded file will be available here
  ) {
    return this.userService.updateProfile(user.id, updateUserDto, user.id, imageFile);
  }

  @Delete('me')
  @ApiOperation({ summary: 'Delete the currently logged-in user\'s profile' })
  @ApiResponse({ status: 200, description: 'Profile successfully deleted' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async deleteProfile(@CurrentUser() user: UserEntity) {
    return this.userService.remove(user.id, user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'User retrieved successfully', type: UserEntity })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUserById(@Param('id') id: string) {
    return this.userService.findOneWithRelations(id);
  }
}
