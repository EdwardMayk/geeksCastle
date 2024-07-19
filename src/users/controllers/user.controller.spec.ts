import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from '../services/user.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../entities/user.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

const mockUserService = () => ({
  createUser: jest.fn(),
  findById: jest.fn(),
});

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{ provide: UserService, useFactory: mockUserService }],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        username: 'john_doe',
        email: 'john@example.com',
        password: 'securePassword',
      };

      const createdUser: User = {
        id: 'abc123',
        username: 'john_doe',
        email: 'john@example.com',
        password: 'securePassword',
      };

      jest.spyOn(service, 'createUser').mockResolvedValue(createdUser);

      const result = await controller.createUser(createUserDto);

      expect(result).toEqual(createdUser);
      expect(service.createUser).toHaveBeenCalledWith(createUserDto);
    });

    it('should return a Bad Request error if DTO is invalid', async () => {
      const invalidCreateUserDto: any = {
        username: 'joh',
        email: 'invalid-email',
      };

      await expect(controller.createUser(invalidCreateUserDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('getUser', () => {
    it('should return a user by ID', async () => {
      const userId = 'abc123';
      const user: User = {
        id: userId,
        username: 'john_doe',
        email: 'john@example.com',
        password: 'securePassword',
      };

      jest.spyOn(service, 'findById').mockResolvedValue(user);

      const result = await controller.getUser(userId);

      expect(result).toEqual(user);
      expect(service.findById).toHaveBeenCalledWith(userId);
    });

    it('should throw a NotFoundException if user is not found', async () => {
      const userId = 'nonexistent-id';
      jest.spyOn(service, 'findById').mockResolvedValue(null);

      await expect(controller.getUser(userId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
