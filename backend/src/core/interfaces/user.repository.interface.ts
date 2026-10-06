import { User } from '../entities/user.entity';
import { Nullable } from '../../shared/types';

export interface IUserRepository {
  findById(id: string): Promise<Nullable<User>>;
  findByEmail(email: string): Promise<Nullable<User>>;
  save(user: User): Promise<User>;
  update(user: User): Promise<User>;
  delete(id: string): Promise<boolean>;
  findAll(limit?: number, skip?: number): Promise<User[]>;
}
