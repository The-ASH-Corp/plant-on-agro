import { Request, Response, NextFunction } from 'express';
import { Container } from '../../infrastructure/di/container';
import { UnauthorizedError, ForbiddenError } from '../../core/errors/app-error';
import { UserPayload } from '../../core/interfaces/jwt-service.interface';
import '../../shared/types';


export const authenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('Authentication token missing or invalid');
    }

    const token = authHeader.substring(7).trim();
    if (!token) {
      throw new UnauthorizedError('Authentication token missing');
    }

    const payload: UserPayload = Container.jwtService.verifyToken(token);
    req.user = payload;
    next();
  } catch (error) {
    next(error);
  }
};


export const authorize = (...roles: Array<'admin' | 'buyer'>) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new UnauthorizedError('Authentication required'));
    }

    if (!roles.includes(req.user.role)) {
      return next(new ForbiddenError('You do not have permission to perform this action'));
    }

    next();
  };
};
