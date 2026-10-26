import crypto from 'crypto';
import { env } from '../../config/env';

export interface PasswordResetOtpProps {
  id?: string;
  email: string;
  otp: string;
  expiresAt: Date;
  used: boolean;
  attempts: number;
  resetToken?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class PasswordResetOtp {
  private readonly _id?: string;
  private readonly _email: string;
  private readonly _otp: string;
  private readonly _expiresAt: Date;
  private _used: boolean;
  private _attempts: number;
  private _resetToken?: string;
  private readonly _createdAt?: Date;
  private _updatedAt?: Date;

  constructor(props: PasswordResetOtpProps) {
    this._id = props.id;
    this._email = props.email.trim().toLowerCase();
    this._otp = props.otp.trim();
    this._expiresAt = props.expiresAt;
    this._used = props.used ?? false;
    this._attempts = props.attempts ?? 0;
    this._resetToken = props.resetToken;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  public get id(): string | undefined {
    return this._id;
  }

  public get email(): string {
    return this._email;
  }

  public get otp(): string {
    return this._otp;
  }

  public get expiresAt(): Date {
    return this._expiresAt;
  }

  public get used(): boolean {
    return this._used;
  }

  public get attempts(): number {
    return this._attempts;
  }

  public get resetToken(): string | undefined {
    return this._resetToken;
  }

  public get createdAt(): Date | undefined {
    return this._createdAt;
  }

  public get updatedAt(): Date | undefined {
    return this._updatedAt;
  }

  public isExpired(): boolean {
    return new Date() > this._expiresAt;
  }

  public isUsed(): boolean {
    return this._used;
  }

  public isMaxAttemptsExceeded(maxAllowed = 5): boolean {
    return this._attempts >= maxAllowed;
  }

  public matches(candidateOtp: string, secret: string = env.JWT_SECRET): boolean {
    const cleanCandidate = candidateOtp.trim();
    if (this._otp.startsWith('sha256:')) {
      const storedHash = this._otp.substring(7);
      const computedHash = crypto
        .createHmac('sha256', secret)
        .update(`${this._email}:${cleanCandidate}`)
        .digest('hex');

      try {
        const storedBuffer = Buffer.from(storedHash, 'hex');
        const computedBuffer = Buffer.from(computedHash, 'hex');
        if (storedBuffer.length !== computedBuffer.length) {
          return false;
        }
        return crypto.timingSafeEqual(storedBuffer, computedBuffer);
      } catch {
        return false;
      }
    }

    try {
      const storedBuffer = Buffer.from(this._otp);
      const candidateBuffer = Buffer.from(cleanCandidate);
      if (storedBuffer.length !== candidateBuffer.length) {
        return false;
      }
      return crypto.timingSafeEqual(storedBuffer, candidateBuffer);
    } catch {
      return false;
    }
  }
}

