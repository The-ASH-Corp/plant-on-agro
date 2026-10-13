import { Request, Response, NextFunction } from 'express';
import { RegisterUserUseCase } from '../../application/use-cases/register-user.use-case';
import { ApiResponse } from '../../shared/utils/api-response';

export class AuthController {
  constructor(private readonly registerUserUseCase: RegisterUserUseCase) {}

  public register = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userResponse = await this.registerUserUseCase.execute(req.body);
      ApiResponse.created(res, userResponse, 'User registered successfully');
    } catch (error) {
      next(error);
    }
  };
}
