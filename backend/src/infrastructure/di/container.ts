import { MongoUserRepository } from '../repositories/mongo-user.repository';
import { MongoTreeVarietyRepository } from '../repositories/mongo-tree-variety.repository';
import { Argon2PasswordHasher } from '../services/argon2-password-hasher.service';

import { CreateUserUseCase } from '../../application/use-cases/create-user.use-case';
import { RegisterUserUseCase } from '../../application/use-cases/register-user.use-case';
import { LoginUserUseCase } from '../../application/use-cases/login-user.use-case';
import { GetUserByIdUseCase } from '../../application/use-cases/get-user-by-id.use-case';

import { CreateTreeVarietyUseCase } from '../../application/use-cases/tree-varieties/create-tree-variety.use-case';
import { GetTreeVarietiesUseCase } from '../../application/use-cases/tree-varieties/get-tree-varieties.use-case';
import { GetTreeVarietyByIdUseCase } from '../../application/use-cases/tree-varieties/get-tree-variety-by-id.use-case';
import { UpdateTreeVarietyUseCase } from '../../application/use-cases/tree-varieties/update-tree-variety.use-case';
import { DeleteTreeVarietyUseCase } from '../../application/use-cases/tree-varieties/delete-tree-variety.use-case';

import { UserController } from '../../presentation/controllers/user.controller';
import { AuthController } from '../../presentation/controllers/auth.controller';
import { TreeVarietyController } from '../../presentation/controllers/tree-variety.controller';

export class Container {
  // Services & Adapters
  private static readonly passwordHasher = new Argon2PasswordHasher();

  // Repositories
  public static readonly userRepository = new MongoUserRepository();
  public static readonly treeVarietyRepository = new MongoTreeVarietyRepository();

  // User Use Cases
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

  // Tree Variety Use Cases
  private static readonly createTreeVarietyUseCase = new CreateTreeVarietyUseCase(
    Container.treeVarietyRepository
  );
  private static readonly getTreeVarietiesUseCase = new GetTreeVarietiesUseCase(
    Container.treeVarietyRepository
  );
  private static readonly getTreeVarietyByIdUseCase = new GetTreeVarietyByIdUseCase(
    Container.treeVarietyRepository
  );
  private static readonly updateTreeVarietyUseCase = new UpdateTreeVarietyUseCase(
    Container.treeVarietyRepository
  );
  private static readonly deleteTreeVarietyUseCase = new DeleteTreeVarietyUseCase(
    Container.treeVarietyRepository
  );

  // Controllers
  public static readonly authController = new AuthController(
    Container.registerUserUseCase,
    Container.loginUserUseCase
  );

  public static readonly userController = new UserController(
    Container.createUserUseCase,
    Container.getUserByIdUseCase
  );

  public static readonly treeVarietyController = new TreeVarietyController(
    Container.createTreeVarietyUseCase,
    Container.getTreeVarietiesUseCase,
    Container.getTreeVarietyByIdUseCase,
    Container.updateTreeVarietyUseCase,
    Container.deleteTreeVarietyUseCase
  );
}
