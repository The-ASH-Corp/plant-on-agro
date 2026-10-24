import { Request, Response, NextFunction } from 'express';
import { RegisterUserUseCase } from '../../application/use-cases/register-user.use-case';
import { LoginUserUseCase } from '../../application/use-cases/login-user.use-case';
import { GetCurrentUserUseCase } from '../../application/use-cases/get-current-user.use-case';
import { RequestPasswordResetOtpUseCase } from '../../application/use-cases/auth/request-password-reset-otp.use-case';
import { VerifyPasswordResetOtpUseCase } from '../../application/use-cases/auth/verify-password-reset-otp.use-case';
import { ResetPasswordWithOtpUseCase } from '../../application/use-cases/auth/reset-password-with-otp.use-case';
import { IUserRepository } from '../../core/interfaces/user.repository.interface';
import { ApiResponse } from '../../shared/utils/api-response';
import { UnauthorizedError } from '../../core/errors/app-error';

export class AuthController {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly loginUserUseCase: LoginUserUseCase,
    private readonly getCurrentUserUseCase: GetCurrentUserUseCase,
    private readonly requestPasswordResetOtpUseCase?: RequestPasswordResetOtpUseCase,
    private readonly verifyPasswordResetOtpUseCase?: VerifyPasswordResetOtpUseCase,
    private readonly resetPasswordWithOtpUseCase?: ResetPasswordWithOtpUseCase,
    private readonly userRepository?: IUserRepository
  ) {}

  public checkEmail = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const email = req.body.email?.trim().toLowerCase();
      let exists = false;
      if (this.userRepository && email) {
        const existing = await this.userRepository.findByEmail(email);
        exists = !!existing;
      }
      ApiResponse.success(
        res,
        { exists, email },
        exists ? 'Email is already registered' : 'Email is available'
      );
    } catch (error) {
      next(error);
    }
  };

  public register = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const authResponse = await this.registerUserUseCase.execute(req.body);
      ApiResponse.created(res, authResponse, 'User registered successfully');
    } catch (error) {
      next(error);
    }
  };

  public login = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const ip = (req.headers['x-forwarded-for'] as string) || req.ip || req.socket.remoteAddress;
      const userAgent = (req.headers['user-agent'] as string) || undefined;

      const authResponse = await this.loginUserUseCase.execute(req.body, { ip, userAgent });
      ApiResponse.success(res, authResponse, 'Login successful');
    } catch (error) {
      next(error);
    }
  };

  public me = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new UnauthorizedError('User session not found');
      }

      const user = await this.getCurrentUserUseCase.execute(userId);
      ApiResponse.success(res, user, 'Current user retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  public requestPasswordResetOtp = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!this.requestPasswordResetOtpUseCase) {
        throw new Error('RequestPasswordResetOtpUseCase not configured');
      }
      const result = await this.requestPasswordResetOtpUseCase.execute(req.body);
      ApiResponse.success(res, result, result.message);
    } catch (error) {
      next(error);
    }
  };

  public verifyPasswordResetOtp = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!this.verifyPasswordResetOtpUseCase) {
        throw new Error('VerifyPasswordResetOtpUseCase not configured');
      }
      const result = await this.verifyPasswordResetOtpUseCase.execute(req.body);
      ApiResponse.success(res, result, result.message);
    } catch (error) {
      next(error);
    }
  };

  public resetPasswordWithOtp = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!this.resetPasswordWithOtpUseCase) {
        throw new Error('ResetPasswordWithOtpUseCase not configured');
      }
      const result = await this.resetPasswordWithOtpUseCase.execute(req.body);
      ApiResponse.success(res, result, result.message);
    } catch (error) {
      next(error);
    }
  };
}
