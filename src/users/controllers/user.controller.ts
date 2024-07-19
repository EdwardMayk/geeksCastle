import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { UserService } from '../services/user.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { validateSync } from 'class-validator';
import { plainToInstance } from 'class-transformer';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
    schema: {
      example: {
        id: 'abc123',
        username: 'testuser',
        email: 'test@example.com',
        password: '#@#31233213dasdasdRWAFWQ2131',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async createUser(@Body() createUserDto: CreateUserDto) {
    const errors = validateSync(plainToInstance(CreateUserDto, createUserDto));
    if (errors.length > 0) {
      throw new BadRequestException('Invalid DTO');
    }
    try {
      const user = await this.userService.createUser(createUserDto);
      return user;
    } catch (error) {
      throw new NotFoundException('User not found');
    }
  }
  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({
    name: 'id',
    description: 'User ID',
    type: String,
    example: 'abc123',
  })
  @ApiResponse({
    status: 200,
    description: 'The user was found.',
    schema: {
      example: {
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'password123',
      },
    },
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async getUser(@Param('id') id: string) {
    const user = await this.userService.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
