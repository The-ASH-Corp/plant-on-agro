import { Request, Response, NextFunction } from 'express';
import { Container } from '../../infrastructure/di/container';
import { redisService } from '../../infrastructure/redis/redis.client';
import { UnauthorizedError, ForbiddenError } from '../../core/errors/app-error';
import { UserPayload } from '../../core/interfaces/jwt-service.interface';
import '../../shared/types';

export const USER_ACTIVE_CACHE_PREFIX = 'poa:user:active:';
const USER_ACTIVE_CACHE_TTL_SEC = 60;

async function isAccountActive(userId: string): Promise<boolean> {
  const cacheKey = `${USER_ACTIVE_CACHE_PREFIX}${userId}`;

  if (redisService.isReady()) {
    try {
      const cached = await redisService.getClient().get(cacheKey);
      if (cached === '1') return true;
      if (cached === '0') return false;
    } catch {
      // Fall through to DB check if Redis read fails
    }
  }

  const user = await Container.userRepository.findById(userId);
  const active = Boolean(user && user.isActive);

  if (redisService.isReady()) {
    try {
      await redisService
        .getClient()
        .set(cacheKey, active ? '1' : '0', 'EX', USER_ACTIVE_CACHE_TTL_SEC);
    } catch {
      // Ignore cache write errors
    }
  }

  return active;
}

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

    // Enforce live account status so blocked/deleted users lose session access immediately
    const active = await isAccountActive(payload.id);
    if (!active) {
      throw new UnauthorizedError('Your account has been deactivated or removed. Please contact support.');
    }

    req.user = payload;
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Optionally authenticates a Bearer token when present without rejecting public guests.
 * Used for endpoints that return redacted public data to guests and full data to owners/admins.
 */
export const optionalAuthenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7).trim();
      if (token) {
        try {
          const payload: UserPayload = Container.jwtService.verifyToken(token);
          const active = await isAccountActive(payload.id);
          if (active) {
            req.user = payload;
          }
        } catch {
          // Treat invalid/expired token on optional route as unauthenticated guest
        }
      }
    }
    next();
  } catch {
    next();
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
