import { IUserRepository } from '../../core/interfaces/user.repository.interface';
import { User } from '../../core/entities/user.entity';
import { UserModel } from '../database/models/user.model';
import { UserMapper } from '../database/mappers/user.mapper';
import { Nullable } from '../../shared/types';

export class MongoUserRepository implements IUserRepository {
  public async findById(id: string): Promise<Nullable<User>> {
    const doc = await UserModel.findById(id).exec();
    if (!doc) return null;
    return UserMapper.toDomain(doc);
  }

  public async findByEmail(email: string): Promise<Nullable<User>> {
    const doc = await UserModel.findOne({ email: email.toLowerCase() }).exec();
    if (!doc) return null;
    return UserMapper.toDomain(doc);
  }

  public async save(user: User): Promise<User> {
    const persistenceData = UserMapper.toPersistence(user);
    const doc = await UserModel.create(persistenceData);
    return UserMapper.toDomain(doc);
  }

  public async update(user: User): Promise<User> {
    if (!user.id) {
      throw new Error('Cannot update user without an ID');
    }
    const persistenceData = UserMapper.toPersistence(user);
    const doc = await UserModel.findByIdAndUpdate(user.id, persistenceData, { new: true }).exec();
    if (!doc) {
      throw new Error(`User with ID ${user.id} not found`);
    }
    return UserMapper.toDomain(doc);
  }

  public async delete(id: string): Promise<boolean> {
    const result = await UserModel.findByIdAndDelete(id).exec();
    return !!result;
  }

  public async findAll(limit = 10, skip = 0): Promise<User[]> {
    const docs = await UserModel.find().limit(limit).skip(skip).exec();
    return docs.map(UserMapper.toDomain);
  }
}
