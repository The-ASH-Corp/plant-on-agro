import { IUserRepository } from '../../core/interfaces/user.repository.interface';
import { PaginatedResult } from '../../shared/types';
import { UserDto } from '../dto/user.dto';

export class GetUsersUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  public async execute(limit = 10, skip = 0): Promise<PaginatedResult<UserDto>> {
    const safeLimit = Math.max(1, limit);
    const safeSkip = Math.max(0, skip);

    const [users, total] = await Promise.all([
      this.userRepository.findAll(safeLimit, safeSkip),
      this.userRepository.count(),
    ]);

    const page = Math.floor(safeSkip / safeLimit) + 1;
    const totalPages = Math.ceil(total / safeLimit) || 1;

    return {
      items: users.map((user) => ({
        id: user.id ?? '',
        name: user.name,
        email: user.email.getValue(),
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      })),
      total,
      page,
      limit: safeLimit,
      totalPages,
    };
  }
}
