import { MongoUserRepository } from '../repositories/mongo-user.repository';
import { Argon2PasswordHasher } from '../services/argon2-password-hasher.service';
import { CreateUserUseCase } from '../../application/use-cases/create-user.use-case';
import { RegisterUserUseCase } from '../../application/use-cases/register-user.use-case';
import { LoginUserUseCase } from '../../application/use-cases/login-user.use-case';
import { GetUserByIdUseCase } from '../../application/use-cases/get-user-by-id.use-case';
import { UserController } from '../../presentation/controllers/user.controller';
import { AuthController } from '../../presentation/controllers/auth.controller';

export class Container {
  // Services & Adapters
  private static readonly passwordHasher = new Argon2PasswordHasher();

  // Repositories
  private static readonly userRepository = new MongoUserRepository();

  // Use Cases
  private static readonly registerUserUseCase = new RegisterUserUseCase(
    Container.userRepository,
    Container.passwordHasher
  );
  private static readonly loginUserUseCase = new LoginUserUseCase(
    Container.userRepository,
    Container.passwordHasher
  );
  
  private static readonly createUserUseCase = new CreateUserUseCase(Container.userRepository);
  private static readonly getUserByIdUseCase = new GetUserByIdUseCase(Container.userRepository);

  // Controllers
  public static readonly authController = new AuthController(
    Container.registerUserUseCase,
    Container.loginUserUseCase
  );

  public static readonly userController = new UserController(
    Container.createUserUseCase,
    Container.getUserByIdUseCase
  );
}
