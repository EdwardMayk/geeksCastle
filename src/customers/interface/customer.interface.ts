import { Customer } from '../entities/customer.entitiy';

export interface CustomerInterface {
  create(customer: Partial<Customer>): Promise<Customer>;
  update(id: string, customer: Partial<Customer>): Promise<Customer>;
  findById(id: string): Promise<Customer | null>;
}
