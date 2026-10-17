import { IUserRepository } from '../../core/interfaces/user.repository.interface';
import { NotFoundError, ConflictError } from '../../core/errors/app-error';
import { Email } from '../../core/value-objects/email.vo';
import { UpdateUserDto, UserDto } from '../dto/user.dto';

export class UpdateUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  public async execute(id: string, dto: UpdateUserDto): Promise<UserDto> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundError('User', id);
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
