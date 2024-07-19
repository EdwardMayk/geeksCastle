import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserRepository } from '../repository/user.repository';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { NotFoundException } from '@nestjs/common';

// Mock del UserRepository
const mockUserRepository = () => ({
  create: jest.fn(),
  update: jest.fn(),
  findById: jest.fn(),
});

describe('UserService', () => {
  let service: UserService;
  let repository: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: UserRepository, useFactory: mockUserRepository },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<UserRepository>(UserRepository);
  });

  describe('createUser', () => {
    it('should successfully create a user', async () => {
      const createUserDto: CreateUserDto = {
        username: 'john_doe',
        email: 'john@example.com',
        password: 'securePassword',
      };
      const createdUser: User = {
        id: '1',
        username: createUserDto.username,
        email: createUserDto.email,
        password: createUserDto.password,
      };

      jest.spyOn(repository, 'create').mockResolvedValue(createdUser);

      const result = await service.createUser(createUserDto);
      expect(result).toEqual(createdUser);
      expect(repository.create).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('findById', () => {
    it('should return a user if found', async () => {
      const id = '123';
      const user: User = {
        id,
        username: 'testuser',
        email: 'testuser@example.com',
      };
      jest.spyOn(repository, 'findById').mockResolvedValue(user);

      const result = await service.findById(id);
      expect(result).toEqual(user);
    });

    it('should throw NotFoundException if user not found', async () => {
      const id = 'nonexistent-id';
      jest.spyOn(repository, 'findById').mockResolvedValue(null);

      await expect(service.findById(id)).rejects.toThrow(NotFoundException);
    });
  });
});
