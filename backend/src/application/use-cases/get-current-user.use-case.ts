import { IUserRepository } from '../../core/interfaces/user.repository.interface';
import { NotFoundError, UnauthorizedError } from '../../core/errors/app-error';
import { UserDto } from '../dto/user.dto';

export class GetCurrentUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  public async execute(userId: string): Promise<UserDto> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundError('User', userId);
    }

    if (!user.isActive) {
      throw new UnauthorizedError('Your account has been deactivated. Please contact support.');
    }

    return {
      id: user.id ?? '',
      name: user.name,
      email: user.email.getValue(),
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }
}
