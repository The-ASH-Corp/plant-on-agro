import { User } from '../../../core/entities/user.entity';
import { Email } from '../../../core/value-objects/email.vo';
import { IUserDocument } from '../models/user.model';

export class UserMapper {
  public static toDomain(doc: IUserDocument): User {
    return new User({
      id: doc._id ? String(doc._id) : undefined,
      name: doc.name,
      email: Email.create(doc.email),
      role: doc.role,
      isActive: doc.isActive,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  public static toPersistence(user: User): Partial<IUserDocument> {
    return {
      name: user.name,
      email: user.email.getValue(),
      role: user.role,
      isActive: user.isActive,
    };
  }
}
