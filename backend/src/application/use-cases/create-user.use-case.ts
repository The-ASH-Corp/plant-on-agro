import { IUserRepository } from '../../core/interfaces/user.repository.interface';
import { User } from '../../core/entities/user.entity';
import { Email } from '../../core/value-objects/email.vo';
import { ConflictError } from '../../core/errors/app-error';
import { CreateUserInputDto, UserResponseDto } from '../dto/user.dto';

export class CreateUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  public async execute(input: CreateUserInputDto): Promise<UserResponseDto> {
    const emailVO = Email.create(input.email);

    const existingUser = await this.userRepository.findByEmail(emailVO.getValue());
    if (existingUser) {
      throw new ConflictError(`User with email '${input.email}' already exists`);
    }

    const user = new User({
      name: input.name,
      email: emailVO,
      role: input.role ?? 'buyer',
      isActive: true,
    });

    const savedUser = await this.userRepository.save(user);

    return {
      id: savedUser.id ?? '',
      name: savedUser.name,
      email: savedUser.email.getValue(),
      role: savedUser.role,
      isActive: savedUser.isActive,
      createdAt: savedUser.createdAt.toISOString(),
      updatedAt: savedUser.updatedAt.toISOString(),
    };
  }
}
