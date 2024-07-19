import { Injectable } from '@nestjs/common';
import { Firestore } from '../../../firebase.config';

import { UserInterface } from '../interface/user.interface';
import { User } from '../entities/user.entity';

@Injectable()
export class UserRepository implements UserInterface {
  private readonly collection = Firestore.collection('users');

  async create(user: Partial<User>): Promise<User> {
    const docRef = await this.collection.add(user);
    const doc = await docRef.get();
    return { id: doc.id, ...doc.data() } as User;
  }

  async findById(id: string): Promise<User> {
    const doc = await this.collection.doc(id).get();

    if (!doc.exists) {
      return null;
    }

    return doc.exists ? ({ id: doc.id, ...doc.data() } as User) : null;
  }
}
