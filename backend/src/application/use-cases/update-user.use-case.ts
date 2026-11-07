import { IUserRepository } from '../../core/interfaces/user.repository.interface';
import { NotFoundError, ConflictError, ForbiddenError } from '../../core/errors/app-error';
import { Email } from '../../core/value-objects/email.vo';
import { UpdateUserDto, UserDto } from '../dto/user.dto';
import { UserPayload } from '../../core/interfaces/jwt-service.interface';

export class UpdateUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  public async execute(id: string, dto: UpdateUserDto, requester?: UserPayload): Promise<UserDto> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundError('User', id);
    }

    if (requester) {
      // Non-admin users can only update their own profile
      if (requester.role !== 'admin' && requester.id !== id) {
        throw new ForbiddenError('Access denied: You can only update your own profile');
      }

      // Non-admin users cannot alter roles or activation status
      if (requester.role !== 'admin') {
        if (dto.role !== undefined || dto.isActive !== undefined) {
          throw new ForbiddenError('Access denied: Only administrators can modify user roles or activation status');
        }
      }

      // Admin self-protection: Admin cannot deactivate or demote their own account
      if (requester.id === id && requester.role === 'admin') {
        if (dto.isActive === false) {
          throw new ForbiddenError('Administrators cannot deactivate their own account');
        }
        if (dto.role !== undefined && dto.role !== 'admin') {
          throw new ForbiddenError('Administrators cannot demote their own account');
        }
      }
    }

    if (dto.name !== undefined) {
      user.updateName(dto.name);
    }

    if (dto.email !== undefined && dto.email.toLowerCase() !== user.email.getValue().toLowerCase()) {
      const existing = await this.userRepository.findByEmail(dto.email);
      if (existing && existing.id !== id) {
        throw new ConflictError(`User with email "${dto.email}" already exists`);
      }
      user.updateEmail(Email.create(dto.email));
    }

    if (dto.role !== undefined) {
      user.changeRole(dto.role);
    }

    if (dto.isActive !== undefined) {
      if (dto.isActive) {
        user.activate();
      } else {
        user.deactivate();
      }
    }

    const updated = await this.userRepository.update(user);

    return {
      id: updated.id ?? '',
      name: updated.name,
      email: updated.email.getValue(),
      role: updated.role,
      isActive: updated.isActive,
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
    };
  }
}
