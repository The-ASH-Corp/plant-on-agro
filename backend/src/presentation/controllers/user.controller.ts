import { Request, Response, NextFunction } from 'express';
import { CreateUserUseCase } from '../../application/use-cases/create-user.use-case';
import { GetUserByIdUseCase } from '../../application/use-cases/get-user-by-id.use-case';
import { GetUsersUseCase } from '../../application/use-cases/get-users.use-case';
import { UpdateUserUseCase } from '../../application/use-cases/update-user.use-case';
import { DeleteUserUseCase } from '../../application/use-cases/delete-user.use-case';
import { ApiResponse } from '../../shared/utils/api-response';
import { ForbiddenError, UnauthorizedError } from '../../core/errors/app-error';

export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly getUserByIdUseCase: GetUserByIdUseCase,
    private readonly getUsersUseCase: GetUsersUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase
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
      const currentUser = req.user;

      if (!currentUser) {
        throw new UnauthorizedError('Authentication required');
      }

      if (currentUser.role !== 'admin' && currentUser.id !== id) {
        throw new ForbiddenError('Access denied: You can only view your own profile');
      }

      const result = await this.getUserByIdUseCase.execute(id as string);
      ApiResponse.success(res, result, 'User retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  public getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const limit = req.query.limit !== undefined ? Number(req.query.limit) : 10;
      const skip = req.query.skip !== undefined ? Number(req.query.skip) : 0;
      const result = await this.getUsersUseCase.execute(limit, skip);
      ApiResponse.success(res, result, 'Users retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  public update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const currentUser = req.user;

      if (!currentUser) {
        throw new UnauthorizedError('Authentication required');
      }

      // Check IDOR: Non-admin users cannot update other users' accounts
      if (currentUser.role !== 'admin' && currentUser.id !== id) {
        throw new ForbiddenError('Access denied: You can only update your own profile');
      }

      // Check privilege escalation: Non-admins cannot alter role or isActive
      if (currentUser.role !== 'admin') {
        if (req.body.role !== undefined || req.body.isActive !== undefined) {
          throw new ForbiddenError('Access denied: Only administrators can modify user roles or activation status');
        }
      }

      // Admin self-protection: Cannot deactivate or demote oneself
      if (currentUser.id === id && currentUser.role === 'admin') {
        if (req.body.isActive === false) {
          throw new ForbiddenError('Administrators cannot deactivate their own account');
        }
        if (req.body.role !== undefined && req.body.role !== 'admin') {
          throw new ForbiddenError('Administrators cannot demote their own account');
        }
      }

      const result = await this.updateUserUseCase.execute(id as string, req.body, currentUser);
      ApiResponse.success(res, result, 'User updated successfully');
    } catch (error) {
      next(error);
    }
  };

  public delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const currentUser = req.user;

      if (!currentUser) {
        throw new UnauthorizedError('Authentication required');
      }

      // Prevent admin from deleting their own account
      if (currentUser.id === id) {
        throw new ForbiddenError('Administrators cannot delete their own account');
      }

      const result = await this.deleteUserUseCase.execute(id as string);
      ApiResponse.success(res, { deleted: result }, 'User deleted successfully');
    } catch (error) {
      next(error);
    }
  };
}

