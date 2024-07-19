import { Injectable } from '@nestjs/common';
import { Firestore } from '../../../firebase.config';
import { CustomerInterface } from '../interface/customer.interface';
import { Customer } from '../entities/customer.entitiy';

@Injectable()
export class CustomerRepository implements CustomerInterface {
  private readonly collection = Firestore.collection('customers');

  async create(customer: Partial<Customer>): Promise<Customer> {
    const docRef = await this.collection.add(customer);
    const doc = await docRef.get();
    return { id: doc.id, ...doc.data() } as Customer;
  }

  async update(id: string, customer: Partial<Customer>): Promise<Customer> {
    await this.collection.doc(id).update(customer);
    const doc = await this.collection.doc(id).get();
    return { id: doc.id, ...doc.data() } as Customer;
  }

  async findById(id: string): Promise<Customer | null> {
    const doc = await this.collection.doc(id).get();
    return doc.exists ? ({ id: doc.id, ...doc.data() } as Customer) : null;
  }
}
