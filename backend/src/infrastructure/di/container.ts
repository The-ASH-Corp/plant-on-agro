import { MongoUserRepository } from '../repositories/mongo-user.repository';
import { CreateUserUseCase } from '../../application/use-cases/create-user.use-case';
import { GetUserByIdUseCase } from '../../application/use-cases/get-user-by-id.use-case';
import { UserController } from '../../presentation/controllers/user.controller';

export class Container {
  // Repositories
  private static readonly userRepository = new MongoUserRepository();

  // Use Cases
  private static readonly createUserUseCase = new CreateUserUseCase(Container.userRepository);
  private static readonly getUserByIdUseCase = new GetUserByIdUseCase(Container.userRepository);

  // Controllers
  public static readonly userController = new UserController(
    Container.createUserUseCase,
    Container.getUserByIdUseCase
  );
}
