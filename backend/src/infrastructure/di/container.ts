import { MongoUserRepository } from '../repositories/mongo-user.repository';
import { MongoTreeVarietyRepository } from '../repositories/mongo-tree-variety.repository';
import { MongoAdoptionPlanRepository } from '../repositories/mongo-adoption-plan.repository';
import { MongoTreeInstanceRepository } from '../repositories/mongo-tree-instance.repository';
import { MongoCertificateRepository } from '../repositories/mongo-certificate.repository';
import { MongoPasswordResetOtpRepository } from '../repositories/mongo-password-reset-otp.repository';
import { Argon2PasswordHasher } from '../services/argon2-password-hasher.service';
import { JsonWebTokenService } from '../services/jwt.service';
import { NodemailerMailService } from '../services/nodemailer-mail.service';

import { CreateUserUseCase } from '../../application/use-cases/create-user.use-case';
import { RegisterUserUseCase } from '../../application/use-cases/register-user.use-case';
import { LoginUserUseCase } from '../../application/use-cases/login-user.use-case';
import { GetUserByIdUseCase } from '../../application/use-cases/get-user-by-id.use-case';
import { GetCurrentUserUseCase } from '../../application/use-cases/get-current-user.use-case';
import { GetUsersUseCase } from '../../application/use-cases/get-users.use-case';
import { UpdateUserUseCase } from '../../application/use-cases/update-user.use-case';
import { DeleteUserUseCase } from '../../application/use-cases/delete-user.use-case';
import { RequestPasswordResetOtpUseCase } from '../../application/use-cases/auth/request-password-reset-otp.use-case';
import { VerifyPasswordResetOtpUseCase } from '../../application/use-cases/auth/verify-password-reset-otp.use-case';
import { ResetPasswordWithOtpUseCase } from '../../application/use-cases/auth/reset-password-with-otp.use-case';


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

import { CreateCertificateUseCase } from '../../application/use-cases/certificates/create-certificate.use-case';
import { GetCertificatesUseCase } from '../../application/use-cases/certificates/get-certificates.use-case';
import { GetCertificateByIdUseCase } from '../../application/use-cases/certificates/get-certificate-by-id.use-case';
import { GetCertificateByNumberUseCase } from '../../application/use-cases/certificates/get-certificate-by-number.use-case';
import { VerifyCertificateUseCase } from '../../application/use-cases/certificates/verify-certificate.use-case';
import { UpdateCertificateUseCase } from '../../application/use-cases/certificates/update-certificate.use-case';
import { DeleteCertificateUseCase } from '../../application/use-cases/certificates/delete-certificate.use-case';

import { MongoLandingPageRepository } from '../repositories/mongo-landing-page.repository';
import { GetLandingPageUseCase } from '../../application/use-cases/landing-page/get-landing-page.use-case';
import { UpdateLandingPageUseCase } from '../../application/use-cases/landing-page/update-landing-page.use-case';
import { ResetLandingPageUseCase } from '../../application/use-cases/landing-page/reset-landing-page.use-case';
import { LandingPageController } from '../../presentation/controllers/landing-page.controller';

import { MongoOrderRepository } from '../repositories/mongo-order.repository';
import { CreateOrderUseCase } from '../../application/use-cases/orders/create-order.use-case';
import { GetOrdersUseCase } from '../../application/use-cases/orders/get-orders.use-case';
import { GetOrderByIdUseCase } from '../../application/use-cases/orders/get-order-by-id.use-case';
import { GetOrderByNumberUseCase } from '../../application/use-cases/orders/get-order-by-number.use-case';
import { UpdateOrderStatusUseCase } from '../../application/use-cases/orders/update-order-status.use-case';
import { MarkOrdersReadUseCase } from '../../application/use-cases/orders/mark-orders-read.use-case';
import { DeleteOrderUseCase } from '../../application/use-cases/orders/delete-order.use-case';
import { OrderController } from '../../presentation/controllers/order.controller';

import { MongoLocationRepository } from '../repositories/mongo-location.repository';
import { CreateLocationUseCase } from '../../application/use-cases/locations/create-location.use-case';
import { GetLocationsUseCase } from '../../application/use-cases/locations/get-locations.use-case';
import { GetLocationByIdUseCase } from '../../application/use-cases/locations/get-location-by-id.use-case';
import { UpdateLocationUseCase } from '../../application/use-cases/locations/update-location.use-case';
import { DeleteLocationUseCase } from '../../application/use-cases/locations/delete-location.use-case';
import { LocationController } from '../../presentation/controllers/location.controller';

import { UserController } from '../../presentation/controllers/user.controller';
import { AuthController } from '../../presentation/controllers/auth.controller';
import { TreeVarietyController } from '../../presentation/controllers/tree-variety.controller';
import { AdoptionPlanController } from '../../presentation/controllers/adoption-plan.controller';
import { TreeInstanceController } from '../../presentation/controllers/tree-instance.controller';
import { CertificateController } from '../../presentation/controllers/certificate.controller';

import { MongoExperienceRepository } from '../repositories/mongo-experience.repository';
import { CreateExperienceUseCase } from '../../application/use-cases/experiences/create-experience.use-case';
import { GetExperiencesUseCase } from '../../application/use-cases/experiences/get-experiences.use-case';
import { GetExperienceByIdUseCase } from '../../application/use-cases/experiences/get-experience-by-id.use-case';
import { UpdateExperienceUseCase } from '../../application/use-cases/experiences/update-experience.use-case';
import { DeleteExperienceUseCase } from '../../application/use-cases/experiences/delete-experience.use-case';
import { ExperienceController } from '../../presentation/controllers/experience.controller';

import { MongoVisitBookingRepository } from '../repositories/mongo-visit-booking.repository';
import { CreateVisitBookingUseCase } from '../../application/use-cases/visits/create-visit-booking.use-case';
import { GetVisitBookingsUseCase } from '../../application/use-cases/visits/get-visit-bookings.use-case';
import { GetVisitBookingByIdUseCase } from '../../application/use-cases/visits/get-visit-booking-by-id.use-case';
import { GetMyVisitsUseCase } from '../../application/use-cases/visits/get-my-visits.use-case';
import { UpdateVisitStatusUseCase } from '../../application/use-cases/visits/update-visit-status.use-case';
import { AddVisitMemoryUseCase } from '../../application/use-cases/visits/add-visit-memory.use-case';
import { DeleteVisitBookingUseCase } from '../../application/use-cases/visits/delete-visit-booking.use-case';
import { VisitBookingController } from '../../presentation/controllers/visit-booking.controller';

import { env } from '../../config/env';
import { RazorpayPaymentService } from '../services/razorpay.service';
import { CreateRazorpayOrderUseCase } from '../../application/use-cases/payment/create-razorpay-order.use-case';
import { VerifyRazorpayPaymentUseCase } from '../../application/use-cases/payment/verify-razorpay-payment.use-case';
import { ProcessRazorpayWebhookUseCase } from '../../application/use-cases/payment/process-razorpay-webhook.use-case';
import { OrderFulfillmentService } from '../../application/services/order-fulfillment.service';
import { PaymentController } from '../../presentation/controllers/payment.controller';

export class Container {

  // Services & Adapters
  private static readonly passwordHasher = new Argon2PasswordHasher();
  public static readonly jwtService = new JsonWebTokenService();
  public static readonly mailService = new NodemailerMailService(
    env.SMTP_HOST,
    env.SMTP_PORT,
    env.SMTP_SECURE,
    env.SMTP_USER,
    env.SMTP_PASS,
    env.SMTP_FROM
  );

  // Repositories
  public static readonly userRepository = new MongoUserRepository();
  public static readonly treeVarietyRepository = new MongoTreeVarietyRepository();
  public static readonly adoptionPlanRepository = new MongoAdoptionPlanRepository();
  public static readonly treeInstanceRepository = new MongoTreeInstanceRepository();
  public static readonly certificateRepository = new MongoCertificateRepository();
  public static readonly landingPageRepository = new MongoLandingPageRepository();
  public static readonly orderRepository = new MongoOrderRepository();
  public static readonly locationRepository = new MongoLocationRepository();
  public static readonly experienceRepository = new MongoExperienceRepository();
  public static readonly visitBookingRepository = new MongoVisitBookingRepository();
  public static readonly passwordResetOtpRepository = new MongoPasswordResetOtpRepository();

  // Experience Use Cases
  private static readonly createExperienceUseCase = new CreateExperienceUseCase(
    Container.experienceRepository
  );
  private static readonly getExperiencesUseCase = new GetExperiencesUseCase(
    Container.experienceRepository
  );
  private static readonly getExperienceByIdUseCase = new GetExperienceByIdUseCase(
    Container.experienceRepository
  );
  private static readonly updateExperienceUseCase = new UpdateExperienceUseCase(
    Container.experienceRepository
  );
  private static readonly deleteExperienceUseCase = new DeleteExperienceUseCase(
    Container.experienceRepository
  );

  // Visit Booking Use Cases
  private static readonly createVisitBookingUseCase = new CreateVisitBookingUseCase(
    Container.visitBookingRepository,
    Container.mailService
  );
  private static readonly getVisitBookingsUseCase = new GetVisitBookingsUseCase(
    Container.visitBookingRepository
  );
  private static readonly getVisitBookingByIdUseCase = new GetVisitBookingByIdUseCase(
    Container.visitBookingRepository
  );
  private static readonly getMyVisitsUseCase = new GetMyVisitsUseCase(
    Container.visitBookingRepository
  );
  private static readonly updateVisitStatusUseCase = new UpdateVisitStatusUseCase(
    Container.visitBookingRepository
  );
  private static readonly addVisitMemoryUseCase = new AddVisitMemoryUseCase(
    Container.visitBookingRepository
  );
  private static readonly deleteVisitBookingUseCase = new DeleteVisitBookingUseCase(
    Container.visitBookingRepository
  );

  // Razorpay Payment Services & Use Cases
  public static readonly paymentGatewayService = new RazorpayPaymentService(
    env.RAZORPAY_KEY_ID,
    env.RAZORPAY_KEY_SECRET,
    env.RAZORPAY_WEBHOOK_SECRET
  );
  private static readonly orderFulfillmentService = new OrderFulfillmentService(
    Container.orderRepository,
    Container.treeInstanceRepository,
    Container.certificateRepository,
    Container.mailService
  );
  private static readonly createRazorpayOrderUseCase = new CreateRazorpayOrderUseCase(
    Container.paymentGatewayService,
    Container.treeVarietyRepository,
    Container.adoptionPlanRepository,
    Container.orderRepository
  );
  private static readonly verifyRazorpayPaymentUseCase = new VerifyRazorpayPaymentUseCase(
    Container.paymentGatewayService,
    Container.orderRepository,
    Container.treeInstanceRepository,
    Container.certificateRepository,
    Container.orderFulfillmentService
  );
  private static readonly processRazorpayWebhookUseCase = new ProcessRazorpayWebhookUseCase(
    Container.paymentGatewayService,
    Container.orderRepository,
    Container.orderFulfillmentService
  );

  // Location Use Cases
  private static readonly createLocationUseCase = new CreateLocationUseCase(
    Container.locationRepository
  );
  private static readonly getLocationsUseCase = new GetLocationsUseCase(
    Container.locationRepository
  );
  private static readonly getLocationByIdUseCase = new GetLocationByIdUseCase(
    Container.locationRepository
  );
  private static readonly updateLocationUseCase = new UpdateLocationUseCase(
    Container.locationRepository
  );
  private static readonly deleteLocationUseCase = new DeleteLocationUseCase(
    Container.locationRepository
  );

  // Order Use Cases
  private static readonly createOrderUseCase = new CreateOrderUseCase(
    Container.orderRepository
  );
  private static readonly getOrdersUseCase = new GetOrdersUseCase(
    Container.orderRepository
  );
  private static readonly getOrderByIdUseCase = new GetOrderByIdUseCase(
    Container.orderRepository
  );
  private static readonly getOrderByNumberUseCase = new GetOrderByNumberUseCase(
    Container.orderRepository
  );
  private static readonly updateOrderStatusUseCase = new UpdateOrderStatusUseCase(
    Container.orderRepository
  );
  private static readonly markOrdersReadUseCase = new MarkOrdersReadUseCase(
    Container.orderRepository
  );
  private static readonly deleteOrderUseCase = new DeleteOrderUseCase(
    Container.orderRepository
  );


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
    Container.passwordHasher,
    Container.jwtService,
    Container.mailService
  );
  private static readonly loginUserUseCase = new LoginUserUseCase(
    Container.userRepository,
    Container.passwordHasher,
    Container.jwtService,
    Container.mailService
  );
  private static readonly getCurrentUserUseCase = new GetCurrentUserUseCase(
    Container.userRepository
  );

  // Password Reset OTP Use Cases
  private static readonly requestPasswordResetOtpUseCase = new RequestPasswordResetOtpUseCase(
    Container.userRepository,
    Container.passwordResetOtpRepository,
    Container.mailService
  );
  private static readonly verifyPasswordResetOtpUseCase = new VerifyPasswordResetOtpUseCase(
    Container.passwordResetOtpRepository
  );
  private static readonly resetPasswordWithOtpUseCase = new ResetPasswordWithOtpUseCase(
    Container.userRepository,
    Container.passwordResetOtpRepository,
    Container.passwordHasher,
    Container.mailService
  );
  
  private static readonly createUserUseCase = new CreateUserUseCase(Container.userRepository);
  private static readonly getUserByIdUseCase = new GetUserByIdUseCase(Container.userRepository);
  private static readonly getUsersUseCase = new GetUsersUseCase(Container.userRepository);
  private static readonly updateUserUseCase = new UpdateUserUseCase(Container.userRepository);
  private static readonly deleteUserUseCase = new DeleteUserUseCase(Container.userRepository);


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

  // Certificate Use Cases
  private static readonly createCertificateUseCase = new CreateCertificateUseCase(
    Container.certificateRepository
  );
  private static readonly getCertificatesUseCase = new GetCertificatesUseCase(
    Container.certificateRepository
  );
  private static readonly getCertificateByIdUseCase = new GetCertificateByIdUseCase(
    Container.certificateRepository
  );
  private static readonly getCertificateByNumberUseCase = new GetCertificateByNumberUseCase(
    Container.certificateRepository
  );
  private static readonly verifyCertificateUseCase = new VerifyCertificateUseCase(
    Container.certificateRepository
  );
  private static readonly updateCertificateUseCase = new UpdateCertificateUseCase(
    Container.certificateRepository
  );
  private static readonly deleteCertificateUseCase = new DeleteCertificateUseCase(
    Container.certificateRepository
  );

  // Controllers
  public static readonly authController = new AuthController(
    Container.registerUserUseCase,
    Container.loginUserUseCase,
    Container.getCurrentUserUseCase,
    Container.requestPasswordResetOtpUseCase,
    Container.verifyPasswordResetOtpUseCase,
    Container.resetPasswordWithOtpUseCase,
    Container.userRepository
  );

  public static readonly userController = new UserController(
    Container.createUserUseCase,
    Container.getUserByIdUseCase,
    Container.getUsersUseCase,
    Container.updateUserUseCase,
    Container.deleteUserUseCase
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

  public static readonly certificateController = new CertificateController(
    Container.createCertificateUseCase,
    Container.getCertificatesUseCase,
    Container.getCertificateByIdUseCase,
    Container.getCertificateByNumberUseCase,
    Container.verifyCertificateUseCase,
    Container.updateCertificateUseCase,
    Container.deleteCertificateUseCase
  );

  public static readonly landingPageController = new LandingPageController(
    Container.getLandingPageUseCase,
    Container.updateLandingPageUseCase,
    Container.resetLandingPageUseCase
  );

  public static readonly orderController = new OrderController(
    Container.createOrderUseCase,
    Container.getOrdersUseCase,
    Container.getOrderByIdUseCase,
    Container.getOrderByNumberUseCase,
    Container.updateOrderStatusUseCase,
    Container.markOrdersReadUseCase,
    Container.deleteOrderUseCase
  );

  public static readonly locationController = new LocationController(
    Container.createLocationUseCase,
    Container.getLocationsUseCase,
    Container.getLocationByIdUseCase,
    Container.updateLocationUseCase,
    Container.deleteLocationUseCase
  );

  public static readonly experienceController = new ExperienceController(
    Container.createExperienceUseCase,
    Container.getExperiencesUseCase,
    Container.getExperienceByIdUseCase,
    Container.updateExperienceUseCase,
    Container.deleteExperienceUseCase
  );

  public static readonly visitBookingController = new VisitBookingController(
    Container.createVisitBookingUseCase,
    Container.getVisitBookingsUseCase,
    Container.getVisitBookingByIdUseCase,
    Container.getMyVisitsUseCase,
    Container.updateVisitStatusUseCase,
    Container.addVisitMemoryUseCase,
    Container.deleteVisitBookingUseCase
  );

  public static readonly paymentController = new PaymentController(
    Container.paymentGatewayService,
    Container.createRazorpayOrderUseCase,
    Container.verifyRazorpayPaymentUseCase,
    Container.processRazorpayWebhookUseCase
  );
}


