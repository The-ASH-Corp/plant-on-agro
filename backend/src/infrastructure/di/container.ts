import { MongoUserRepository } from '../repositories/mongo-user.repository';
import { MongoTreeVarietyRepository } from '../repositories/mongo-tree-variety.repository';
import { MongoAdoptionPlanRepository } from '../repositories/mongo-adoption-plan.repository';
import { MongoTreeInstanceRepository } from '../repositories/mongo-tree-instance.repository';
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

import { CreateAdoptionPlanUseCase } from '../../application/use-cases/adoption-plans/create-adoption-plan.use-case';
import { GetAdoptionPlansUseCase } from '../../application/use-cases/adoption-plans/get-adoption-plans.use-case';
import { GetAdoptionPlanByIdUseCase } from '../../application/use-cases/adoption-plans/get-adoption-plan-by-id.use-case';
import { UpdateAdoptionPlanUseCase } from '../../application/use-cases/adoption-plans/update-adoption-plan.use-case';
import { DeleteAdoptionPlanUseCase } from '../../application/use-cases/adoption-plans/delete-adoption-plan.use-case';

import { CreateTreeInstanceUseCase } from '../../application/use-cases/tree-instances/create-tree-instance.use-case';
import { GetTreeInstancesUseCase } from '../../application/use-cases/tree-instances/get-tree-instances.use-case';
import { GetTreeInstanceByIdUseCase } from '../../application/use-cases/tree-instances/get-tree-instance-by-id.use-case';
import { GetTreeInstanceByTagUseCase } from '../../application/use-cases/tree-instances/get-tree-instance-by-tag.use-case';
import { UpdateTreeInstanceUseCase } from '../../application/use-cases/tree-instances/update-tree-instance.use-case';
import { DeleteTreeInstanceUseCase } from '../../application/use-cases/tree-instances/delete-tree-instance.use-case';

import { MongoLandingPageRepository } from '../repositories/mongo-landing-page.repository';
import { GetLandingPageUseCase } from '../../application/use-cases/landing-page/get-landing-page.use-case';
import { UpdateLandingPageUseCase } from '../../application/use-cases/landing-page/update-landing-page.use-case';
import { ResetLandingPageUseCase } from '../../application/use-cases/landing-page/reset-landing-page.use-case';
import { LandingPageController } from '../../presentation/controllers/landing-page.controller';

import { UserController } from '../../presentation/controllers/user.controller';
import { AuthController } from '../../presentation/controllers/auth.controller';
import { TreeVarietyController } from '../../presentation/controllers/tree-variety.controller';
import { AdoptionPlanController } from '../../presentation/controllers/adoption-plan.controller';
import { TreeInstanceController } from '../../presentation/controllers/tree-instance.controller';

export class Container {
  // Services & Adapters
  private static readonly passwordHasher = new Argon2PasswordHasher();

  // Repositories
  public static readonly userRepository = new MongoUserRepository();
  public static readonly treeVarietyRepository = new MongoTreeVarietyRepository();
  public static readonly adoptionPlanRepository = new MongoAdoptionPlanRepository();
  public static readonly treeInstanceRepository = new MongoTreeInstanceRepository();
  public static readonly landingPageRepository = new MongoLandingPageRepository();

  // Landing Page Use Cases
  private static readonly getLandingPageUseCase = new GetLandingPageUseCase(
    Container.landingPageRepository
  );
  private static readonly updateLandingPageUseCase = new UpdateLandingPageUseCase(
    Container.landingPageRepository
  );
  private static readonly resetLandingPageUseCase = new ResetLandingPageUseCase(
    Container.landingPageRepository
  );

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

  // Adoption Plan Use Cases
  private static readonly createAdoptionPlanUseCase = new CreateAdoptionPlanUseCase(
    Container.adoptionPlanRepository
  );
  private static readonly getAdoptionPlansUseCase = new GetAdoptionPlansUseCase(
    Container.adoptionPlanRepository
  );
  private static readonly getAdoptionPlanByIdUseCase = new GetAdoptionPlanByIdUseCase(
    Container.adoptionPlanRepository
  );
  private static readonly updateAdoptionPlanUseCase = new UpdateAdoptionPlanUseCase(
    Container.adoptionPlanRepository
  );
  private static readonly deleteAdoptionPlanUseCase = new DeleteAdoptionPlanUseCase(
    Container.adoptionPlanRepository
  );

  // Tree Instance Use Cases
  private static readonly createTreeInstanceUseCase = new CreateTreeInstanceUseCase(
    Container.treeInstanceRepository
  );
  private static readonly getTreeInstancesUseCase = new GetTreeInstancesUseCase(
    Container.treeInstanceRepository
  );
  private static readonly getTreeInstanceByIdUseCase = new GetTreeInstanceByIdUseCase(
    Container.treeInstanceRepository
  );
  private static readonly getTreeInstanceByTagUseCase = new GetTreeInstanceByTagUseCase(
    Container.treeInstanceRepository
  );
  private static readonly updateTreeInstanceUseCase = new UpdateTreeInstanceUseCase(
    Container.treeInstanceRepository
  );
  private static readonly deleteTreeInstanceUseCase = new DeleteTreeInstanceUseCase(
    Container.treeInstanceRepository
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

  public static readonly adoptionPlanController = new AdoptionPlanController(
    Container.createAdoptionPlanUseCase,
    Container.getAdoptionPlansUseCase,
    Container.getAdoptionPlanByIdUseCase,
    Container.updateAdoptionPlanUseCase,
    Container.deleteAdoptionPlanUseCase
  );

  public static readonly treeInstanceController = new TreeInstanceController(
    Container.createTreeInstanceUseCase,
    Container.getTreeInstancesUseCase,
    Container.getTreeInstanceByIdUseCase,
    Container.getTreeInstanceByTagUseCase,
    Container.updateTreeInstanceUseCase,
    Container.deleteTreeInstanceUseCase
  );

  public static readonly landingPageController = new LandingPageController(
    Container.getLandingPageUseCase,
    Container.updateLandingPageUseCase,
    Container.resetLandingPageUseCase
  );
}
