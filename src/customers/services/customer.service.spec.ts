// src/customers/services/customer.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { CustomerService } from './customer.service';
import { CustomerRepository } from '../repository/customer.repository';
import { CreateCustomerDto } from '../dto/create-customer.dto';
import { Customer } from '../entities/customer.entitiy';

const mockCustomerRepository = () => ({
  create: jest.fn(),
  findById: jest.fn(),
  update: jest.fn(),
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

describe('CustomerService', () => {
  let service: CustomerService;
  let customerRepository: CustomerRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomerService,
        { provide: CustomerRepository, useFactory: mockCustomerRepository },
      ],
    }).compile();

    service = module.get<CustomerService>(CustomerService);
    customerRepository = module.get<CustomerRepository>(CustomerRepository);
  });

  describe('createCustomer', () => {
    it('should create and return a customer with age calculated', async () => {
      const birthday = new Date('1990-01-01');
      const createCustomerDto: CreateCustomerDto = {
        name: 'John',
        lastname: 'Doe',
        birthday,
      };
      const age = calculateAge(birthday);
      const createdCustomer: Customer = {
        id: '1',
        ...createCustomerDto,
        age,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest
        .spyOn(customerRepository, 'create')
        .mockResolvedValue(createdCustomer);

      expect(await service.createCustomer(createCustomerDto)).toEqual(
        createdCustomer,
      );
    });

    it('should throw an error if creation fails', async () => {
      const createCustomerDto: CreateCustomerDto = {
        name: 'John',
        lastname: 'Doe',
        birthday: new Date('1990-01-01'),
      };

      jest
        .spyOn(customerRepository, 'create')
        .mockRejectedValue(new Error('Creation failed'));

      await expect(service.createCustomer(createCustomerDto)).rejects.toThrow(
        'Creation failed',
      );
    });
  });

  describe('updateCustomer', () => {
    it('should update and return a customer with age recalculated', async () => {
      const id = '1';
      const birthday = new Date('1990-01-01');
      const updateCustomerDto: Partial<CreateCustomerDto> = {
        name: 'John',
        lastname: 'Smith',
        birthday,
      };
      const existingCustomer: Customer = {
        id,
        name: 'John',
        lastname: 'Doe',
        birthday: new Date('1990-01-01'),
        age: calculateAge(new Date('1990-01-01')),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const age = calculateAge(birthday);
      const updatedCustomer: Customer = {
        ...existingCustomer,
        ...updateCustomerDto,
        age,
        updatedAt: new Date(),
      };

      jest
        .spyOn(customerRepository, 'findById')
        .mockResolvedValue(existingCustomer);
      jest
        .spyOn(customerRepository, 'update')
        .mockResolvedValue(updatedCustomer);

      expect(await service.updateCustomer(id, updateCustomerDto)).toEqual(
        updatedCustomer,
      );
    });

    it('should throw an error if update fails', async () => {
      const id = '1';
      const updateCustomerDto: Partial<CreateCustomerDto> = {
        name: 'John',
        lastname: 'Smith',
        birthday: new Date('1990-01-01'),
      };

      jest.spyOn(customerRepository, 'findById').mockResolvedValue(null);
      jest
        .spyOn(customerRepository, 'update')
        .mockRejectedValue(new Error('Update failed'));

      await expect(
        service.updateCustomer(id, updateCustomerDto),
      ).rejects.toThrow('Update failed');
    });
  });
});
