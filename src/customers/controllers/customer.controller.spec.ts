import { Test, TestingModule } from '@nestjs/testing';
import { CustomerController } from './customer.controller';
import { CustomerService } from '../services/customer.service';
import { CreateCustomerDto } from '../dto/create-customer.dto';
import { Customer } from '../entities/customer.entitiy';
import { BadRequestException } from '@nestjs/common';

const mockCustomerService = () => ({
  createCustomer: jest.fn(),
  updateCustomer: jest.fn(),
});

const calculateAge = (birthday: Date): number => {
  const today = new Date();
  let age = today.getFullYear() - birthday.getFullYear();
  const monthDifference = today.getMonth() - birthday.getMonth();

  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birthday.getDate())
  ) {
    age--;
  }

  return age;
};

describe('CustomerController', () => {
  let controller: CustomerController;
  let service: CustomerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomerController],
      providers: [
        { provide: CustomerService, useFactory: mockCustomerService },
      ],
    }).compile();

    controller = module.get<CustomerController>(CustomerController);
    service = module.get<CustomerService>(CustomerService);
  });

  describe('createCustomer', () => {
    it('should create and return a customer', async () => {
      const createCustomerDto: CreateCustomerDto = {
        name: 'John',
        lastname: 'Doe',
        birthday: new Date('1990-01-01'),
      };
      const age = calculateAge(createCustomerDto.birthday);
      const createdCustomer: Customer = {
        id: 'abc123',
        ...createCustomerDto,
        age,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(service, 'createCustomer').mockResolvedValue(createdCustomer);

      expect(await controller.createCustomer(createCustomerDto)).toEqual(
        createdCustomer,
      );
    });

    it('should throw an error if service fails', async () => {
      const createCustomerDto: CreateCustomerDto = {
        name: 'John',
        lastname: 'Doe',
        birthday: new Date('1990-01-01'),
      };

      jest
        .spyOn(service, 'createCustomer')
        .mockRejectedValue(new Error('Service error'));

      await expect(
        controller.createCustomer(createCustomerDto),
      ).rejects.toThrow('Service error');
    });
  });

  describe('createCustomer', () => {
    it('should throw BadRequestException if DTO validation fails', async () => {
      const invalidCreateCustomerDto: Partial<CreateCustomerDto> = {
        name: 'Jo',
        lastname: '',
        birthday: new Date('invalid-date') as any,
      };

      jest.spyOn(service, 'createCustomer').mockImplementation(() => {
        throw new BadRequestException('Invalid DTO');
      });

      await expect(
        controller.createCustomer(
          invalidCreateCustomerDto as CreateCustomerDto,
        ),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('updateCustomer', () => {
    it('should update and return a customer', async () => {
      const id = 'abc123';
      const updateCustomerDto: CreateCustomerDto = {
        name: 'John',
        lastname: 'Doe',
        birthday: new Date('1990-01-01'),
      };
      const age = calculateAge(updateCustomerDto.birthday);
      const updatedCustomer: Customer = {
        id,
        ...updateCustomerDto,
        age,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(service, 'updateCustomer').mockResolvedValue(updatedCustomer);

      expect(await controller.updateCustomer(id, updateCustomerDto)).toEqual(
        updatedCustomer,
      );
    });

    it('should throw an error if service fails', async () => {
      const id = 'abc123';
      const updateCustomerDto: CreateCustomerDto = {
        name: 'John',
        lastname: 'Doe',
        birthday: new Date('1990-01-01'),
      };

      jest
        .spyOn(service, 'updateCustomer')
        .mockRejectedValue(new Error('Service error'));

      await expect(
        controller.updateCustomer(id, updateCustomerDto),
      ).rejects.toThrow('Service error');
    });
  });
});
