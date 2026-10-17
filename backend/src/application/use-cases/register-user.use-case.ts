import { IUserRepository } from '../../core/interfaces/user.repository.interface';
import { IPasswordHasher } from '../../core/interfaces/password-hasher.interface';
import { IJwtService } from '../../core/interfaces/jwt-service.interface';
import { User, UserRole } from '../../core/entities/user.entity';
import { Email } from '../../core/value-objects/email.vo';
import { Password, HashedPassword } from '../../core/value-objects/password.vo';
import { ConflictError, BadRequestError } from '../../core/errors/app-error';
import { RegisterUserInputDto } from '../dto/register-user.dto';
import { AuthResponseDto } from '../dto/auth-response.dto';

export class RegisterUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordHasher: IPasswordHasher,
    private readonly jwtService: IJwtService
  ) {}

  public async execute(input: RegisterUserInputDto): Promise<AuthResponseDto> {
    const emailVO = Email.create(input.email);
    const passwordVO = Password.create(input.password);

    const allowedRoles: UserRole[] = ['buyer'];
    const selectedRole: UserRole = 'buyer';

    if (input.role && !allowedRoles.includes(input.role)) {
      throw new BadRequestError('Invalid role specified for self-registration');
    }

    const existingUser = await this.userRepository.findByEmail(emailVO.getValue());
    if (existingUser) {
      throw new ConflictError('An account with this email already exists');
    }

    const rawHashed = await this.passwordHasher.hash(passwordVO.getValue());
    const passwordHashVO = HashedPassword.create(rawHashed);

    const user = new User({
      name: input.name.trim(),
      email: emailVO,
      passwordHash: passwordHashVO,
      role: selectedRole,
      isActive: true,
    });

    const savedUser = await this.userRepository.save(user);

    const userDto = {
      id: savedUser.id ?? '',
      name: savedUser.name,
      email: savedUser.email.getValue(),
      role: savedUser.role,
      isActive: savedUser.isActive,
      createdAt: savedUser.createdAt.toISOString(),
    };

    const token = this.jwtService.generateToken({
      id: userDto.id,
      email: userDto.email,
      role: userDto.role,
    });

    return {
      user: userDto,
      token,
    };
  }
}

