import { IUserRepository } from '../../core/interfaces/user.repository.interface';
import { NotFoundError } from '../../core/errors/app-error';
import { UserResponseDto } from '../dto/user.dto';

export class GetUserByIdUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  public async execute(id: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundError('User', id);
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
