import { Request, Response, NextFunction } from 'express';
import { RegisterUserUseCase } from '../../application/use-cases/register-user.use-case';
import { LoginUserUseCase } from '../../application/use-cases/login-user.use-case';
import { ApiResponse } from '../../shared/utils/api-response';

export class AuthController {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly loginUserUseCase: LoginUserUseCase
  ) {}

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
      const authResponse = await this.loginUserUseCase.execute(req.body);
      ApiResponse.success(res, authResponse, 'Login successful');
    } catch (error) {
      next(error);
    }
  };
}
