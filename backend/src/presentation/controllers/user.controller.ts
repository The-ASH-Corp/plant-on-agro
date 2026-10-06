import { Request, Response, NextFunction } from 'express';
import { CreateUserUseCase } from '../../application/use-cases/create-user.use-case';
import { GetUserByIdUseCase } from '../../application/use-cases/get-user-by-id.use-case';
import { ApiResponse } from '../../shared/utils/api-response';

export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly getUserByIdUseCase: GetUserByIdUseCase
  ) {}

  public create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.createUserUseCase.execute(req.body);
      ApiResponse.created(res, result, 'User created successfully');
    } catch (error) {
      next(error);
    }
  };

  public getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const result = await this.getUserByIdUseCase.execute(id as string);
      ApiResponse.success(res, result, 'User retrieved successfully');
    } catch (error) {
      next(error);
    }
  };
}
