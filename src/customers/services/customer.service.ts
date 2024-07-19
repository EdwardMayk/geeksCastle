import { Injectable } from '@nestjs/common';
import { Customer } from '../entities/customer.entitiy';
import { CustomerRepository } from '../repository/customer.repository';

@Injectable()
export class CustomerService {
  constructor(private readonly customerRepository: CustomerRepository) {}

  async createCustomer(customer: Partial<Customer>): Promise<Customer> {
    return this.customerRepository.create(customer);
  }

  async updateCustomer(
    id: string,
    customer: Partial<Customer>,
  ): Promise<Customer> {
    const existingCustomer = await this.customerRepository.findById(id);

    if (!existingCustomer) {
      throw new Error('Update failed');
    }

    const updateCustomer = await this.customerRepository.update(id, {
      ...existingCustomer,
      ...customer,
    });

    return updateCustomer;
  }
}
