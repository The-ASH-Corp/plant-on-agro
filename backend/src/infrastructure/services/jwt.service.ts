import jwt from 'jsonwebtoken';
import {
  IJwtService,
  UserPayload,
  ResetPasswordTokenPayload,
} from '../../core/interfaces/jwt-service.interface';
import { env } from '../../config/env';
import { UnauthorizedError } from '../../core/errors/app-error';

export class JsonWebTokenService implements IJwtService {
  private readonly secret: string;
  private readonly expiresIn: string;

  constructor(secret = env.JWT_SECRET, expiresIn = env.JWT_EXPIRES_IN) {
    this.secret = secret;
    this.expiresIn = expiresIn;
  }

  public generateToken(payload: UserPayload): string {
    return jwt.sign(payload, this.secret, {
      expiresIn: this.expiresIn as any,
    });
  }

  public verifyToken(token: string): UserPayload {
    try {
      const decoded = jwt.verify(token, this.secret) as UserPayload;
      return decoded;
    } catch {
      throw new UnauthorizedError('Invalid or expired authentication token');
    }
  }

  public generateResetToken(payload: ResetPasswordTokenPayload, expiresIn = '15m'): string {
    return jwt.sign(payload, this.secret, {
      expiresIn: expiresIn as any,
    });
  }

  public verifyResetToken(token: string): ResetPasswordTokenPayload {
    try {
      const decoded = jwt.verify(token, this.secret) as ResetPasswordTokenPayload;
      if (decoded.purpose !== 'password_reset') {
        throw new UnauthorizedError('Invalid token purpose');
      }
      return decoded;
    } catch {
      throw new UnauthorizedError('Invalid or expired password reset token');
    }
  }
}
