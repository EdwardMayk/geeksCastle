import { User } from '../entities/user.entity';

export interface UserInterface {
  create(user: Partial<User>): Promise<User>;
  findById(id: string): Promise<User | null>;
}
