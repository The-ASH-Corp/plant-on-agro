import { User } from '../../../core/entities/user.entity';
import { Email } from '../../../core/value-objects/email.vo';
import { HashedPassword } from '../../../core/value-objects/password.vo';
import { IUserDocument } from '../models/user.model';

export class UserMapper {
  public static toDomain(doc: IUserDocument): User {
    return new User({
      id: doc._id ? String(doc._id) : undefined,
      name: doc.name,
      email: Email.create(doc.email),
      passwordHash: doc.password ? HashedPassword.create(doc.password) : undefined,
      role: doc.role,
      isActive: doc.isActive,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  public static toPersistence(user: User): Partial<IUserDocument> {
    const data: Partial<IUserDocument> = {
      name: user.name,
      email: user.email.getValue(),
      role: user.role,
      isActive: user.isActive,
    };

    if (user.passwordHash) {
      data.password = user.passwordHash.getValue();
    }

    return data;
  }
}
