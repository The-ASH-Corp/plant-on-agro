import { BadRequestError } from '../errors/app-error';
import { normalizeEmail } from '../../shared/utils/string.util';

export class Email {
  private readonly value: string;

  private constructor(email: string) {
    this.value = email;
  }

  public static create(email: string): Email {
    if (!email || typeof email !== 'string') {
      throw new BadRequestError('Email address must be a non-empty string');
    }

    const normalized = normalizeEmail(email);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalized)) {
      throw new BadRequestError(`Invalid email address format: ${email}`);
    }

    return new Email(normalized);
  }

  public getValue(): string {
    return this.value;
  }

  public equals(other: Email | string): boolean {
    if (!other) return false;
    const otherVal = typeof other === 'string' ? other : other.getValue();
    return this.value === normalizeEmail(otherVal);
  }

  public toString(): string {
    return this.value;
  }
}
