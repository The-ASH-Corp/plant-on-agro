import { IUserRepository } from '../../core/interfaces/user.repository.interface';
import { NotFoundError } from '../../core/errors/app-error';

export class DeleteUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  public async execute(id: string): Promise<boolean> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundError('User', id);
    }

    return this.userRepository.delete(id);
  }
}
