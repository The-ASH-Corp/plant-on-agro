import { IUserRepository } from '../../core/interfaces/user.repository.interface';
import { IPasswordHasher } from '../../core/interfaces/password-hasher.interface';
import { UnauthorizedError, ForbiddenError } from '../../core/errors/app-error';
import { Email } from '../../core/value-objects/email.vo';
import { RegisterUserResponseDto } from '../dto/register-user.dto';

export interface LoginUserInputDto {
  email: string;
  password: string;
}

export class LoginUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordHasher: IPasswordHasher
  ) {}

  public async execute(input: LoginUserInputDto): Promise<RegisterUserResponseDto> {
    const emailVO = Email.create(input.email);

    // Fetch user with hashed password from database
    const user = await this.userRepository.findByEmailWithPassword(emailVO.getValue());
    if (!user || !user.passwordHash) {
      // OWASP A07: Generic error message to prevent user enumeration
      throw new UnauthorizedError('Invalid email or password');
    }

    if (!user.isActive) {
      throw new ForbiddenError('Your account has been deactivated. Please contact support.');
    }

    // Verify Argon2id hash using constant-time comparison
    const isPasswordValid = await this.passwordHasher.verify(
      user.passwordHash.getValue(),
      input.password
    );

    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid email or password');
    }

    return {
      id: user.id ?? '',
      name: user.name,
      email: user.email.getValue(),
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt.toISOString(),
    };
  }
}
